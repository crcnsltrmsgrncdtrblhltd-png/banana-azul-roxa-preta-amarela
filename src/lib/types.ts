import type { UF } from "@/lib/constants";

export interface VaquejadaResumo {
  id: number;
  slug: string;
  nome: string;
  cidade: string;
  uf: string;
  dataInicio: string;
  dataFim: string;
  vendaEncerraEm: string;
  posterUrl: string | null;
}

export interface CategoriaResumo {
  id: number;
  nome: string;
  regras: string;
  preco: number;
}

export interface SessaoEvento {
  dia: string;
  descricao: string;
}

export interface VaquejadaDetalhe extends VaquejadaResumo {
  descricao: string;
  categorias: CategoriaResumo[];
  programacao: SessaoEvento[];
}

export interface ListarVaquejadasParams {
  uf?: UF;
  busca?: string;
  periodo?: "esse-mes" | "proximo-mes";
  pagina?: number;
}

export interface Paginado<TItem> {
  itens: TItem[];
  pagina: number;
  totalPaginas: number;
  total: number;
}
