"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { getPaymentProvider } from "@/server/payment";
import { documentoValido, normalizarDocumento } from "@/lib/documento";
import type { CompraState } from "@/server/compra-types";

const RESERVA_MINUTOS = 15;

const compraSchema = z.object({
  eventoId: z.coerce.number().int().positive(),
  categoriaId: z.coerce.number().int().positive(),
  diaId: z.coerce.number().int().positive(),
  numero: z.coerce.number().int().positive(),
  vaqueiroNome: z.string().trim().min(3, "Informe o nome do vaqueiro"),
  vaqueiroCpf: z
    .string()
    .trim()
    .refine(documentoValido, "CPF do vaqueiro inválido"),
  apelido: z.string().trim().optional().default(""),
  cidade: z.string().trim().min(1, "Informe a cidade"),
  uf: z.string().trim().min(2, "UF inválida"),
  cavaloPuxador: z.string().trim().optional().default(""),
  esteireiro: z.string().trim().optional().default(""),
  cavaloEsteireiro: z.string().trim().optional().default(""),
  representacao: z.string().trim().optional().default(""),
  boiNaTv: z.string().optional().default("false"),
  metodo: z.enum(["CARTAO", "BOLETO", "PIX"]),
  parcelas: z.coerce.number().int().min(1).max(12).default(1),
});

export async function comprarSenhaAction(
  _prev: CompraState,
  formData: FormData,
): Promise<CompraState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "LOGIN_REQUIRED" };
  }

  const parsed = compraSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const d = parsed.data;

  const categoria = await prisma.categoria.findUnique({
    where: { id: d.categoriaId },
  });
  if (!categoria || categoria.eventoId !== d.eventoId) {
    return { error: "Categoria inválida." };
  }
  const boiNaTv = d.boiNaTv === "true";
  const valorBoiTv = boiNaTv ? 20 : 0;
  const valor =
    Number(categoria.preco) + Number(categoria.taxaAdministrativa) + valorBoiTv;

  try {
    const pedido = await prisma.$transaction(async (tx) => {
      const senha = await tx.senha.findUnique({
        where: {
          eventoId_categoriaId_diaId_numero: {
            eventoId: d.eventoId,
            categoriaId: d.categoriaId,
            diaId: d.diaId,
            numero: d.numero,
          },
        },
      });
      if (!senha) {
        throw new Error("Senha não encontrada.");
      }

      const reservada = await tx.senha.updateMany({
        where: { id: senha.id, status: "DISPONIVEL" },
        data: {
          status: "RESERVADA",
          reservadaAte: new Date(Date.now() + RESERVA_MINUTOS * 60_000),
        },
      });
      if (reservada.count !== 1) {
        throw new Error(
          "Esta senha acabou de ser reservada por outra pessoa.",
        );
      }

      const novo = await tx.pedido.create({
        data: {
          usuarioId: session.user.id,
          total: valor,
          status: "PENDENTE",
          metodoPagamento: d.metodo,
          parcelas: d.parcelas,
          itens: { create: { senhaId: senha.id, valor } },
        },
      });

      return { pedidoId: novo.id, senhaId: senha.id };
    });

    const descricao = `Senha ${d.numero} - ${categoria.nome}`;
    const cobranca = await getPaymentProvider().criarCobranca({
      pedidoId: pedido.pedidoId,
      valor,
      metodo: d.metodo,
      parcelas: d.parcelas,
      descricao,
    });

    const totalParcelas = cobranca.totalParcelas ?? 1;
    const valorParcela = cobranca.valorParcela ?? valor;

    await prisma.pagamento.create({
      data: {
        pedidoId: pedido.pedidoId,
        provider: cobranca.provider,
        providerRef: cobranca.providerRef,
        checkoutUrl: cobranca.checkoutUrl ?? null,
        metodo: d.metodo,
        numeroParcela: 1,
        totalParcelas,
        valor: valorParcela,
        status: "PENDENTE",
      },
    });

    if (cobranca.checkoutUrl) {
      return {
        ok: true,
        pedidoId: pedido.pedidoId,
        checkoutUrl: cobranca.checkoutUrl,
      };
    }

    if (!cobranca.aprovado && !cobranca.checkoutUrl) {
      await prisma.$transaction([
        prisma.senha.update({
          where: { id: pedido.senhaId },
          data: { status: "DISPONIVEL", reservadaAte: null },
        }),
        prisma.pedido.update({
          where: { id: pedido.pedidoId },
          data: { status: "CANCELADO" },
        }),
      ]);
      return {
        error:
          cobranca.mensagem ?? "Pagamento não aprovado. Tente novamente.",
      };
    }

    if (cobranca.aprovado) {
      await prisma.$transaction([
        prisma.senha.update({
          where: { id: pedido.senhaId },
          data: {
            status: "VENDIDA",
            reservadaAte: null,
            compradorId: session.user.id,
            vaqueiroNome: d.vaqueiroNome,
            vaqueiroCpf: normalizarDocumento(d.vaqueiroCpf),
            apelido: d.apelido || null,
            cidade: d.cidade,
            uf: d.uf.toUpperCase(),
          },
        }),
        prisma.pedido.update({
          where: { id: pedido.pedidoId },
          data: { status: "PAGO" },
        }),
      ]);
      return { ok: true, pedidoId: pedido.pedidoId };
    }

    // WashPay redirect (split ou normal): redireciona pra página de status
    await prisma.senha.update({
      where: { id: pedido.senhaId },
      data: {
        compradorId: session.user.id,
        vaqueiroNome: d.vaqueiroNome,
        vaqueiroCpf: normalizarDocumento(d.vaqueiroCpf),
        apelido: d.apelido || null,
        cidade: d.cidade,
        uf: d.uf.toUpperCase(),
        cavaloPuxador: d.cavaloPuxador || null,
        esteireiro: d.esteireiro || null,
        cavaloEsteireiro: d.cavaloEsteireiro || null,
        representacao: d.representacao || null,
        boiNaTv: d.boiNaTv === "true",
      },
    });

    return {
      ok: true,
      pedidoId: pedido.pedidoId,
      checkoutUrl: `/cliente/pedido/${pedido.pedidoId}`,
    };
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Erro ao processar a compra.";
    return { error: msg };
  }
}
