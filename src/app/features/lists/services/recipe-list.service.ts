import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeList, RecipeListCreateRequest } from '../models/recipe-list.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeListService {
  private apiUrl = 'http://localhost:8080/lists';

  constructor(private http: HttpClient) {}

  obtenerPorUsuario(usuarioId: number): Observable<RecipeList[]> {
    return this.http.get<RecipeList[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  crear(datos: RecipeListCreateRequest): Observable<RecipeList> {
    return this.http.post<RecipeList>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: RecipeListCreateRequest): Observable<RecipeList> {
    return this.http.put<RecipeList>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}