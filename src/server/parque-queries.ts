import "server-only";
import { prisma } from "@/server/db";

export async function getParquePainel(usuarioId: string) {
  const parque = await prisma.parque.findUnique({
    where: { usuarioId },
    include: {
      eventos: {
        orderBy: { dataInicio: "asc" },
        include: {
          senhas: { select: { status: true } },
        },
      },
    },
  });

  if (!parque) {
    return null;
  }

  const eventos = parque.eventos.map((e) => {
    const total = e.senhas.length;
    const vendidas = e.senhas.filter((s) => s.status === "VENDIDA").length;
    return {
      id: e.id,
      slug: e.slug,
      nome: e.nome,
      cidade: e.cidade,
      uf: e.uf,
      status: e.status,
      total,
      vendidas,
      disponiveis: e.senhas.filter((s) => s.status === "DISPONIVEL").length,
    };
  });

  return { parque, eventos };
}

export async function getEventoDoParque(
  eventoId: number,
  usuarioId: string,
) {
  const evento = await prisma.evento.findUnique({
    where: { id: eventoId },
    include: {
      parque: true,
      categorias: { orderBy: { id: "asc" } },
      dias: { orderBy: { data: "asc" } },
      senhas: {
        where: { status: "VENDIDA" },
        include: {
          categoria: true,
          dia: true,
          itemPedido: { include: { pedido: true } },
        },
        orderBy: [{ categoriaId: "asc" }, { numero: "asc" }],
      },
    },
  });

  if (!evento || evento.parque.usuarioId !== usuarioId) {
    return null;
  }

  const receita = evento.senhas.reduce(
    (acc, s) => acc + Number(s.itemPedido?.valor ?? 0),
    0,
  );

  return { evento, receita };
}
