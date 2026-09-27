export interface RecipeStep {
  id: number;
  numeroOrden: number;
  descripcion: string;
  imagen: string | null;
}

export interface RecipeStepCreateRequest {
  numeroOrden: number;
  descripcion: string;
  receta: { id: number };
}