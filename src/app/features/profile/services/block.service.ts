import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Block } from '../models/block.model';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private apiUrl = 'http://localhost:8080/block';

  constructor(private http: HttpClient) {}

  obtenerBloqueados(): Observable<Block[]> {
    return this.http.get<Block[]>(this.apiUrl);
  }

  bloquear(bloqueadoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${bloqueadoId}`, {});
  }

  desbloquear(bloqueadoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bloqueadoId}`);
  }
}