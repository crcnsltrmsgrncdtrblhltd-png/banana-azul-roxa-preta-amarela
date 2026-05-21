export interface Disponibilidade {
  categorias: { id: number; nome: string; preco: number }[];
  dias: { id: number; label: string }[];
  // chave "categoriaId:diaId" -> números disponíveis
  numeros: Record<string, number[]>;
}

export interface CompraState {
  error?: string;
  ok?: boolean;
  pedidoId?: string;
  checkoutUrl?: string;
}
