import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeStep, RecipeStepCreateRequest } from '../models/recipe-step.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeStepService {
  private apiUrl = 'http://localhost:8080/recipes';

  constructor(private http: HttpClient) {}

  obtenerPorReceta(recipeId: number): Observable<RecipeStep[]> {
    return this.http.get<RecipeStep[]>(`${this.apiUrl}/${recipeId}/steps`);
  }

  crear(recipeId: number, datos: RecipeStepCreateRequest): Observable<RecipeStep> {
    return this.http.post<RecipeStep>(`${this.apiUrl}/${recipeId}/steps`, datos);
  }

  eliminar(recipeId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}/steps/${id}`);
  }
}