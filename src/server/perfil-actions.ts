"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/server/db";

export interface PerfilState {
  error?: string;
  ok?: boolean;
}

const perfilSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().trim().min(10, "Telefone inválido"),
  cep: z.string().trim().optional().default(""),
  rua: z.string().trim().optional().default(""),
  numero: z.string().trim().optional().default(""),
  bairro: z.string().trim().optional().default(""),
  cidade: z.string().trim().optional().default(""),
  uf: z.string().trim().optional().default(""),
});

export async function atualizarPerfilAction(
  _prev: PerfilState,
  formData: FormData,
): Promise<PerfilState> {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado." };

  const parsed = perfilSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      nome: parsed.data.nome,
      email: parsed.data.email || null,
      telefone: parsed.data.telefone.replace(/\D/g, ""),
    },
  });

  revalidatePath("/cliente/meus-dados");
  revalidatePath("/cliente/painel");
  return { ok: true };
}

export async function alterarSenhaAction(
  _prev: PerfilState,
  formData: FormData,
): Promise<PerfilState> {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado." };

  const nova = String(formData.get("novaSenha") ?? "");
  if (nova.length < 6) {
    return { error: "A nova senha deve ter ao menos 6 caracteres." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: await bcrypt.hash(nova, 10) },
  });

  return { ok: true };
}
