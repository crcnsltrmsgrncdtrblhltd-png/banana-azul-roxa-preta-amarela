import "server-only";
import { prisma } from "@/server/db";

export async function getAdminOverview() {
  const [parques, eventos, senhasVendidas, pedidosPagos, usuarios, reembolsos] =
    await Promise.all([
      prisma.parque.count(),
      prisma.evento.count(),
      prisma.senha.count({ where: { status: "VENDIDA" } }),
      prisma.pedido.count({ where: { status: "PAGO" } }),
      prisma.user.count(),
      prisma.reembolso.count(),
    ]);

  const receitaAgg = await prisma.pedido.aggregate({
    where: { status: "PAGO" },
    _sum: { total: true },
  });

  return {
    parques,
    eventos,
    senhasVendidas,
    pedidosPagos,
    usuarios,
    reembolsos,
    receita: Number(receitaAgg._sum.total ?? 0),
  };
}

export async function listarEventosAdmin() {
  return prisma.evento.findMany({
    orderBy: { dataInicio: "asc" },
    include: {
      parque: true,
      _count: { select: { senhas: true } },
    },
  });
}

export async function listarParquesAdmin() {
  return prisma.parque.findMany({
    orderBy: { nome: "asc" },
    include: {
      usuario: { select: { email: true, telefone: true } },
      _count: { select: { eventos: true } },
    },
  });
}

export async function listarUsuariosAdmin() {
  return prisma.user.findMany({
    orderBy: { criadoEm: "desc" },
    select: {
      id: true,
      nome: true,
      tipo: true,
      email: true,
      telefone: true,
      cpfCnpj: true,
      criadoEm: true,
    },
  });
}

export async function listarReembolsosAdmin() {
  return prisma.reembolso.findMany({
    orderBy: { criadoEm: "desc" },
    include: { pedido: { include: { usuario: true } } },
  });
}
