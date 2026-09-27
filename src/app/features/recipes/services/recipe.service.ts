import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

export interface RecipeCreateRequest {
  titulo: string;
  descripcion: string;
  tiempoPreparacion: number | null;
  tiempoCoccion: number | null;
  tiempoReposo: number | null;
  raciones: number | null;
  dificultad: string | null;
  publicada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8080/recipes';

  constructor(private http: HttpClient) {}

  obtenerPublicas(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  obtenerRecientes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recientes`);
  }

  obtenerMisRecetas(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/mis-recetas`);
  }

  obtenerPorId(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  crear(receta: RecipeCreateRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, receta);
  }

  actualizar(id: number, receta: RecipeCreateRequest): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, receta);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscar(titulo: string, categoriaId: number | null, dificultad: string): Observable<Recipe[]> {
    let params = new HttpParams();
    if (titulo) {
      params = params.set('titulo', titulo);
    }
    if (categoriaId !== null) {
      params = params.set('categoriaId', categoriaId.toString());
    }
    if (dificultad) {
      params = params.set('dificultad', dificultad);
    }
    return this.http.get<Recipe[]>(`${this.apiUrl}/buscar`, { params });
  }
}