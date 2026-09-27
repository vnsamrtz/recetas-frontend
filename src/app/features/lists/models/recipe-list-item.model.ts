import { Recipe } from '@features/recipes/models/recipe.model';

export interface RecipeListItem {
  id: number;
  orden: number | null;
  fechaAgregado: string;
  receta: Recipe;
}