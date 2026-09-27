import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Follow } from '../models/follow.model';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'http://localhost:8080/follow';

  constructor(private http: HttpClient) {}

  seguir(seguidoId: number): Observable<Follow> {
    return this.http.post<Follow>(`${this.apiUrl}/${seguidoId}`, {});
  }

  dejarDeSeguir(seguidoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${seguidoId}`);
  }

  obtenerSeguidos(usuarioId: number): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.apiUrl}/${usuarioId}/seguidos`);
  }

  obtenerSeguidores(usuarioId: number): Observable<Follow[]> {
    return this.http.get<Follow[]>(`${this.apiUrl}/${usuarioId}/seguidores`);
  }

  eliminarSeguidor(seguidorId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/seguidores/${seguidorId}`);
  }
}