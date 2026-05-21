"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/server/db";

export interface AcaoState {
  error?: string;
  ok?: boolean;
}

async function exigirAdmin() {
  const session = await auth();
  if (!session?.user || session.user.tipo !== "ADMIN") {
    return false;
  }
  return true;
}

const statusEventoSchema = z.object({
  eventoId: z.coerce.number().int().positive(),
  status: z.enum(["RASCUNHO", "PUBLICADO", "ENCERRADO"]),
});

export async function alterarStatusEventoAction(
  _prev: AcaoState,
  formData: FormData,
): Promise<AcaoState> {
  if (!(await exigirAdmin())) {
    return { error: "Não autorizado." };
  }

  const parsed = statusEventoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  await prisma.evento.update({
    where: { id: parsed.data.eventoId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/painel/eventos");
  return { ok: true };
}

const reembolsoSchema = z.object({
  reembolsoId: z.string().min(1),
  decisao: z.enum(["PROCESSADO", "NEGADO"]),
});

export async function decidirReembolsoAction(
  _prev: AcaoState,
  formData: FormData,
): Promise<AcaoState> {
  if (!(await exigirAdmin())) {
    return { error: "Não autorizado." };
  }

  const parsed = reembolsoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const reembolso = await prisma.reembolso.findUnique({
    where: { id: parsed.data.reembolsoId },
    include: { pedido: true },
  });
  if (!reembolso) {
    return { error: "Reembolso não encontrado." };
  }

  await prisma.$transaction([
    prisma.reembolso.update({
      where: { id: reembolso.id },
      data: {
        status: parsed.data.decisao,
        processadoEm: new Date(),
        valorEstornado:
          parsed.data.decisao === "PROCESSADO" ? reembolso.pedido.total : null,
      },
    }),
    prisma.pedido.update({
      where: { id: reembolso.pedidoId },
      data: {
        status:
          parsed.data.decisao === "PROCESSADO" ? "REEMBOLSADO" : "PAGO",
      },
    }),
  ]);

  revalidatePath("/admin/painel/reembolsos");
  return { ok: true };
}
