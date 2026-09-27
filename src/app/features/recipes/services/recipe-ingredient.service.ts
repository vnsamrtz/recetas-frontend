import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeIngredient, RecipeIngredientCreateRequest } from '../models/recipe-ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientService {
  private apiUrl = 'http://localhost:8080/recipes';

  constructor(private http: HttpClient) {}

  obtenerPorReceta(recipeId: number): Observable<RecipeIngredient[]> {
    return this.http.get<RecipeIngredient[]>(`${this.apiUrl}/${recipeId}/ingredients`);
  }

  crear(recipeId: number, datos: RecipeIngredientCreateRequest): Observable<RecipeIngredient> {
    return this.http.post<RecipeIngredient>(`${this.apiUrl}/${recipeId}/ingredients`, datos);
  }

  eliminar(recipeId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}/ingredients/${id}`);
  }
}