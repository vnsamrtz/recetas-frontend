export interface Recipe {
  id: number;
  titulo: string;
  descripcion: string;
  tiempoPreparacion: number | null;
  tiempoCoccion: number | null;
  tiempoReposo: number | null;
  raciones: number | null;
  dificultad: string | null;
  publicada: boolean;
  fechaCreacion: string | null;
  imagenPrincipal: string | null;
  autorId: number;
  autorNombre: string;
  categoriaId: number | null;
  categoriaNombre: string | null;
}