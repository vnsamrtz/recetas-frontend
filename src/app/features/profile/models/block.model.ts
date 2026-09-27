export interface Block {
  id: number;
  fecha: string;
  bloqueador: { id: number; nombre: string };
  bloqueado: { id: number; nombre: string };
}