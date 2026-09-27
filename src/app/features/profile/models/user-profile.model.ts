import { Recipe } from '@features/recipes/models/recipe.model';

export interface RecipeListSummary {
  id: number;
  nombre: string;
  publica: boolean;
  esFavoritos: boolean;
}

export interface UserProfile {
  id: number;
  nombre: string;
  fotoPerfil: string | null;
  biografia: string | null;
  recetas: Recipe[];
  listas: RecipeListSummary[];
  totalSeguidores: number;
  totalSeguidos: number;
  esPropio: boolean;
}