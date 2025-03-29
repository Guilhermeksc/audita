import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (!token) {
    return router.parseUrl('/login');
  }

  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp && exp > now) {
      return true;
    }
    return router.parseUrl('/login');
  } catch {
    return router.parseUrl('/login');
  }
};

export const AuthChildGuard: CanActivateFn = (childRoute, state) => {
  return AuthGuard(childRoute, state);
};
