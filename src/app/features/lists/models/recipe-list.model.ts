export interface RecipeList {
  id: number;
  nombre: string;
  publica: boolean;
  esFavoritos: boolean;
  propietario: { id: number };
}

export interface RecipeListCreateRequest {
  nombre: string;
  publica: boolean;
  propietario: { id: number };
}