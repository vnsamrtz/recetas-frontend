import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  obtenerPerfil(usuarioId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${usuarioId}/perfil`);
  }

  buscarUsuarios(nombre: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:8080/users/buscar`, { params: { nombre } });
}
}