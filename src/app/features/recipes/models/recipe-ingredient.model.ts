export interface RecipeIngredient {
  id: number;
  descripcion: string;
  orden: number | null;
}

export interface RecipeIngredientCreateRequest {
  descripcion: string;
  orden: number | null;
  receta: { id: number };
}