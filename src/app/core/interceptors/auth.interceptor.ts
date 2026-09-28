import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@features/auth/services/auth.service';
import { environment } from '../../../environments/environment';

const API_LOCAL = 'http://localhost:8080';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  const url = req.url.startsWith(API_LOCAL)
    ? environment.apiUrl + req.url.substring(API_LOCAL.length)
    : req.url;

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({ url, setHeaders: headers }));
};