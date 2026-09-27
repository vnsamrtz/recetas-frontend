import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeListItem } from '../models/recipe-list-item.model';
import { RecipeList } from '../models/recipe-list.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeListItemService {
  private apiUrl = 'http://localhost:8080/lists';

  constructor(private http: HttpClient) {}

  obtenerLista(listaId: number): Observable<RecipeList> {
    return this.http.get<RecipeList>(`${this.apiUrl}/${listaId}`);
  }

  obtenerItems(listaId: number): Observable<RecipeListItem[]> {
    return this.http.get<RecipeListItem[]>(`${this.apiUrl}/${listaId}/recetas`);
  }

  anadirReceta(listaId: number, recetaId: number): Observable<RecipeListItem> {
    return this.http.post<RecipeListItem>(`${this.apiUrl}/${listaId}/recetas/${recetaId}`, {});
  }

  quitarReceta(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recetas/${itemId}`);
  }

  reordenar(listaId: number, itemIdsEnOrden: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${listaId}/recetas/reordenar`, itemIdsEnOrden);
  }
}