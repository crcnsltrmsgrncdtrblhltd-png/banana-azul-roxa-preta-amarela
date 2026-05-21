import "server-only";
import { prisma } from "@/server/db";
import type { Disponibilidade } from "@/server/compra-types";

export async function obterDisponibilidade(
  eventoId: number,
): Promise<Disponibilidade | null> {
  const evento = await prisma.evento.findUnique({
    where: { id: eventoId },
    include: {
      categorias: { orderBy: { id: "asc" } },
      dias: { orderBy: { data: "asc" } },
      senhas: {
        where: { status: "DISPONIVEL" },
        select: { categoriaId: true, diaId: true, numero: true },
      },
    },
  });

  if (!evento) {
    return null;
  }

  const numeros: Record<string, number[]> = {};
  for (const s of evento.senhas) {
    const chave = `${s.categoriaId}:${s.diaId}`;
    (numeros[chave] ??= []).push(s.numero);
  }
  for (const chave of Object.keys(numeros)) {
    numeros[chave].sort((a, b) => a - b);
  }

  return {
    categorias: evento.categorias.map((c) => ({
      id: c.id,
      nome: c.nome,
      preco: Number(c.preco),
    })),
    dias: evento.dias.map((d) => ({ id: d.id, label: d.label })),
    numeros,
  };
}
