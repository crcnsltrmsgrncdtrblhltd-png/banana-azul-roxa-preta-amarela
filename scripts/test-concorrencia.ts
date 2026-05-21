import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function reservarEVender(clienteId: string, senhaId: string) {
  return prisma.$transaction(async (tx) => {
    const r = await tx.senha.updateMany({
      where: { id: senhaId, status: "DISPONIVEL" },
      data: { status: "RESERVADA", reservadaAte: new Date(Date.now() + 60000) },
    });
    if (r.count !== 1) {
      throw new Error("indisponivel");
    }
    const pedido = await tx.pedido.create({
      data: {
        usuarioId: clienteId,
        total: 100,
        status: "PAGO",
        metodoPagamento: "PIX",
        itens: { create: { senhaId, valor: 100 } },
      },
    });
    await tx.senha.update({
      where: { id: senhaId },
      data: { status: "VENDIDA", compradorId: clienteId, reservadaAte: null },
    });
    return pedido.id;
  });
}

async function main() {
  const cliente = await prisma.user.findFirstOrThrow({
    where: { tipo: "CLIENTE" },
  });
  const senha = await prisma.senha.findFirstOrThrow({
    where: { status: "DISPONIVEL" },
  });

  const resultados = await Promise.allSettled([
    reservarEVender(cliente.id, senha.id),
    reservarEVender(cliente.id, senha.id),
    reservarEVender(cliente.id, senha.id),
  ]);

  const ok = resultados.filter((r) => r.status === "fulfilled").length;
  const falha = resultados.filter((r) => r.status === "rejected").length;
  const final = await prisma.senha.findUniqueOrThrow({
    where: { id: senha.id },
  });
  const pedidos = await prisma.itemPedido.count({
    where: { senhaId: senha.id },
  });

  console.log(`Tentativas: 3 | Sucesso: ${ok} | Falha: ${falha}`);
  console.log(`Status final da senha: ${final.status}`);
  console.log(`ItensPedido para a senha: ${pedidos}`);

  const passou = ok === 1 && falha === 2 && final.status === "VENDIDA" && pedidos === 1;
  console.log(passou ? "PASS: venda unica garantida" : "FAIL: venda duplicada!");

  // limpeza: devolve a senha ao estado original
  await prisma.itemPedido.deleteMany({ where: { senhaId: senha.id } });
  await prisma.pedido.deleteMany({ where: { usuarioId: cliente.id, total: 100 } });
  await prisma.senha.update({
    where: { id: senha.id },
    data: { status: "DISPONIVEL", compradorId: null, reservadaAte: null },
  });

  process.exit(passou ? 0 : 1);
}

main().finally(() => prisma.$disconnect());
