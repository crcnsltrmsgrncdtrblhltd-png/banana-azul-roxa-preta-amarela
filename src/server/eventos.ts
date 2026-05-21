import { prisma } from "@/server/db";
import type {
  ListarVaquejadasParams,
  Paginado,
  VaquejadaResumo,
  VaquejadaDetalhe,
} from "@/lib/types";

const POR_PAGINA = 100;

function inicioDoMes(offset: number): Date {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth() + offset, 1);
}

function diaIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}

interface EventoBase {
  id: number;
  slug: string;
  nome: string;
  cidade: string;
  uf: string;
  dataInicio: Date;
  dataFim: Date;
  vendaEncerraEm: Date;
  posterUrl: string | null;
}

function paraResumo(e: EventoBase): VaquejadaResumo {
  return {
    id: e.id,
    slug: e.slug,
    nome: e.nome,
    cidade: e.cidade,
    uf: e.uf,
    dataInicio: diaIso(e.dataInicio),
    dataFim: diaIso(e.dataFim),
    vendaEncerraEm: e.vendaEncerraEm.toISOString(),
    posterUrl: e.posterUrl,
  };
}

type WhereEvento = NonNullable<
  Parameters<typeof prisma.evento.findMany>[0]
>["where"];

function montarWhere(params: ListarVaquejadasParams): WhereEvento {
  const where: WhereEvento = { status: "PUBLICADO" };

  if (params.uf) {
    where.uf = params.uf;
  }

  if (params.busca) {
    const termo = params.busca.trim();
    where.OR = [
      { nome: { contains: termo, mode: "insensitive" } },
      { cidade: { contains: termo, mode: "insensitive" } },
    ];
  }

  if (params.periodo) {
    const offset = params.periodo === "proximo-mes" ? 1 : 0;
    where.dataInicio = {
      gte: inicioDoMes(offset),
      lt: inicioDoMes(offset + 1),
    };
  }

  return where;
}

export async function listarVaquejadas(
  params: ListarVaquejadasParams = {},
): Promise<Paginado<VaquejadaResumo>> {
  const where = montarWhere(params);
  const pagina = Math.max(1, params.pagina ?? 1);

  const todos = await prisma.evento.findMany({
    where,
    orderBy: { vendaEncerraEm: "asc" },
  });

  const agora = new Date();
  const ativos = todos.filter((e) => e.vendaEncerraEm >= agora);
  const encerrados = todos.filter((e) => e.vendaEncerraEm < agora);
  const ordenados = [...ativos, ...encerrados];

  const total = ordenados.length;
  const itens = ordenados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

  return {
    itens: itens.map(paraResumo),
    pagina,
    totalPaginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
    total,
  };
}

export async function vaquejadasDestaque(
  limite = 3,
): Promise<VaquejadaResumo[]> {
  const itens = await prisma.evento.findMany({
    where: { status: "PUBLICADO" },
    orderBy: { vendaEncerraEm: "asc" },
    take: limite,
  });
  return itens.map(paraResumo);
}

export async function obterVaquejada(
  id: number,
): Promise<VaquejadaResumo | null> {
  const evento = await prisma.evento.findUnique({ where: { id } });
  return evento ? paraResumo(evento) : null;
}

export async function obterVaquejadaDetalhe(
  id: number,
): Promise<VaquejadaDetalhe | null> {
  const evento = await prisma.evento.findUnique({
    where: { id },
    include: {
      categorias: { orderBy: { id: "asc" } },
      dias: { orderBy: { data: "asc" } },
    },
  });

  if (!evento) {
    return null;
  }

  return {
    ...paraResumo(evento),
    descricao:
      evento.descricao ??
      "Venda antecipada de senhas para esta vaquejada.",
    categorias: evento.categorias.map((c) => ({
      id: c.id,
      nome: c.nome,
      regras: c.regras,
      preco: Number(c.preco),
    })),
    programacao: evento.dias.map((d) => ({
      dia: d.label,
      descricao: d.data.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      }),
    })),
  };
}
