export interface Follow {
  id: number;
  fecha: string;
  seguidor: { id: number; nombre: string };
  seguido: { id: number; nombre: string };
}