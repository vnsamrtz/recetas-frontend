import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8080/recipes';

  constructor(private http: HttpClient) {}

  marcar(recipeId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${recipeId}/favorite`, {});
  }

  quitar(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}/favorite`);
  }
}