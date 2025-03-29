import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.authService.refreshToken().pipe(
            switchMap((response) => {
              this.isRefreshing = false;
              const newToken = this.authService.getAccessToken();
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(clonedReq);
            }),
            catchError(err => {
              this.isRefreshing = false;
              this.authService.logout();
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
