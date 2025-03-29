import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(nip: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/token/`, { nip, password }).pipe(
      tap(response => this.setTokens(response.access, response.refresh))
    );
  }

  logout(): void {
    this.clearTokens();
    this.snackBar.open('Sua sessão expirou. Faça login novamente.', 'Fechar', {
      duration: 5000,
      verticalPosition: 'top'
    });
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem(this.refreshTokenKey);
    if (!refresh) return throwError(() => new Error('Sem refresh token'));

    return this.http.post<any>(`${environment.apiUrl}/token/refresh/`, { refresh }).pipe(
      tap(response => this.setAccessToken(response.access)),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  private setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  private setAccessToken(access: string): void {
    localStorage.setItem(this.accessTokenKey, access);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}