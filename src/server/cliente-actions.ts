"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { getPaymentProvider } from "@/server/payment";
import { documentoValido, normalizarDocumento } from "@/lib/documento";

export interface AcaoState {
  error?: string;
  ok?: boolean;
}

const editarSchema = z.object({
  senhaId: z.string().min(1),
  vaqueiroNome: z.string().trim().min(3, "Informe o nome do vaqueiro"),
  vaqueiroCpf: z
    .string()
    .trim()
    .refine(documentoValido, "CPF do vaqueiro inválido"),
  apelido: z.string().trim().optional().default(""),
  cidade: z.string().trim().min(2, "Informe a cidade"),
  uf: z.string().trim().length(2, "UF inválida"),
});

export async function editarSenhaAction(
  _prev: AcaoState,
  formData: FormData,
): Promise<AcaoState> {
  const session = await auth();
  if (!session?.user || session.user.tipo !== "CLIENTE") {
    return { error: "Não autorizado." };
  }

  const parsed = editarSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const d = parsed.data;

  const senha = await prisma.senha.findUnique({
    where: { id: d.senhaId },
    include: { evento: true },
  });
  if (!senha || senha.compradorId !== session.user.id) {
    return { error: "Senha não encontrada." };
  }
  if (senha.evento.vendaEncerraEm.getTime() < Date.now()) {
    return { error: "Período de alteração encerrado para este evento." };
  }

  await prisma.senha.update({
    where: { id: senha.id },
    data: {
      vaqueiroNome: d.vaqueiroNome,
      vaqueiroCpf: normalizarDocumento(d.vaqueiroCpf),
      apelido: d.apelido || null,
      cidade: d.cidade,
      uf: d.uf.toUpperCase(),
    },
  });

  revalidatePath("/cliente/painel");
  return { ok: true };
}

export async function solicitarExclusaoAction(
  _prev: AcaoState,
): Promise<AcaoState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Não autorizado." };
  }

  await prisma.auditLog.create({
    data: {
      usuarioId: session.user.id,
      acao: "SOLICITACAO_EXCLUSAO_DADOS",
      entidade: "User",
      detalhe: "Titular solicitou exclusão de dados (LGPD).",
    },
  });

  return { ok: true };
}

export async function cancelarPedidoAction(
  _prev: AcaoState,
  formData: FormData,
): Promise<AcaoState> {
  const session = await auth();
  if (!session?.user || session.user.tipo !== "CLIENTE") {
    return { error: "Não autorizado." };
  }

  const pedidoId = String(formData.get("pedidoId") ?? "");
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      itens: { include: { senha: { include: { evento: true } } } },
      pagamentos: true,
    },
  });

  if (!pedido || pedido.usuarioId !== session.user.id) {
    return { error: "Pedido não encontrado." };
  }
  if (pedido.status !== "PAGO") {
    return { error: "Apenas pedidos pagos podem ser cancelados." };
  }

  const algumEncerrado = pedido.itens.some(
    (i) => i.senha.evento.vendaEncerraEm.getTime() < Date.now(),
  );
  if (algumEncerrado) {
    return {
      error:
        "Cancelamento indisponível: a venda antecipada do evento já encerrou.",
    };
  }

  for (const pag of pedido.pagamentos) {
    if (pag.providerRef) {
      await getPaymentProvider().estornar(pag.providerRef);
    }
  }

  await prisma.$transaction([
    ...pedido.itens.map((i) =>
      prisma.senha.update({
        where: { id: i.senhaId },
        data: {
          status: "DISPONIVEL",
          compradorId: null,
          vaqueiroNome: null,
          vaqueiroCpf: null,
          apelido: null,
          reservadaAte: null,
        },
      }),
    ),
    ...pedido.pagamentos.map((pag) =>
      prisma.pagamento.update({
        where: { id: pag.id },
        data: { status: "ESTORNADO" },
      }),
    ),
    prisma.pedido.update({
      where: { id: pedido.id },
      data: { status: "REEMBOLSADO" },
    }),
    prisma.reembolso.create({
      data: {
        pedidoId: pedido.id,
        motivo: "Cancelamento solicitado pelo cliente",
        status: "PROCESSADO",
        valorEstornado: pedido.total,
        processadoEm: new Date(),
      },
    }),
  ]);

  revalidatePath("/cliente/painel");
  return { ok: true };
}
