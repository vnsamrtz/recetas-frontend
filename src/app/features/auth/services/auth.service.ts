import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, datos).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify({
          id: respuesta.userId,
          nombre: respuesta.nombre,
          email: respuesta.email
        }));
      })
    );
  }

  register(datos: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, datos).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify({
          id: respuesta.userId,
          nombre: respuesta.nombre,
          email: respuesta.email
        }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  eliminarCuenta(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/users/${usuarioId}`);
  }

  actualizarBiografia(usuarioId: number, biografia: string): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/users/${usuarioId}/biografia`, { biografia });
  }

  actualizarNombre(usuarioId: number, nombre: string): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/users/${usuarioId}/nombre`, { nombre }).pipe(
      tap(() => {
        const usuario = this.obtenerUsuarioActual();
        if (usuario) {
          localStorage.setItem('usuario', JSON.stringify({ ...usuario, nombre }));
        }
      })
    );
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuarioActual(): { id: number; nombre: string; email: string } | null {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }
}