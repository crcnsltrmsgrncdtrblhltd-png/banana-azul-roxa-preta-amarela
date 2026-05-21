"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { signIn, signOut } from "@/auth";
import {
  cadastroSchema,
  loginSchema,
  recuperarSchema,
} from "@/lib/schemas";
import { normalizarDocumento, normalizarTelefone } from "@/lib/documento";

export interface FormState {
  error?: string;
  ok?: boolean;
}

export async function cadastrarAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = cadastroSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    senha: formData.get("senha"),
    cpfCnpj: formData.get("cpfCnpj"),
    dataNascimento: formData.get("dataNascimento"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const dados = parsed.data;
  const cpfCnpj = normalizarDocumento(dados.cpfCnpj);
  const telefone = normalizarTelefone(dados.telefone);

  const existente = await prisma.user.findFirst({
    where: { OR: [{ cpfCnpj }, { telefone }] },
  });
  if (existente) {
    return { error: "Já existe uma conta com este CPF/CNPJ ou telefone." };
  }

  await prisma.user.create({
    data: {
      tipo: "CLIENTE",
      nome: dados.nome,
      cpfCnpj,
      telefone,
      dataNascimento: new Date(dados.dataNascimento),
      passwordHash: await bcrypt.hash(dados.senha, 10),
    },
  });

  try {
    await signIn("credentials", {
      identificador: cpfCnpj,
      senha: dados.senha,
      redirectTo: "/cliente/painel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada. Faça login para continuar." };
    }
    throw error;
  }

  return { ok: true };
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    identificador: formData.get("identificador"),
    senha: formData.get("senha"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const redirectTo =
    typeof formData.get("redirect") === "string" &&
    String(formData.get("redirect")).startsWith("/")
      ? String(formData.get("redirect"))
      : "/cliente/painel";

  try {
    await signIn("credentials", {
      identificador: parsed.data.identificador,
      senha: parsed.data.senha,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail/CPF/telefone ou senha incorretos." };
    }
    throw error;
  }

  return { ok: true };
}

export async function sairAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export async function recuperarAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const novaSenha = String(formData.get("novaSenha") ?? "");
  const parsed = recuperarSchema.safeParse({
    nome: formData.get("nome"),
    cpfCnpj: formData.get("cpfCnpj"),
    dataNascimento: formData.get("dataNascimento"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  if (novaSenha.length < 6) {
    return { error: "A nova senha deve ter ao menos 6 caracteres." };
  }

  const cpfCnpj = normalizarDocumento(parsed.data.cpfCnpj);
  const user = await prisma.user.findFirst({
    where: {
      cpfCnpj,
      nome: { equals: parsed.data.nome.trim(), mode: "insensitive" },
    },
  });

  const nascOk =
    user &&
    user.dataNascimento.toISOString().slice(0, 10) ===
      new Date(parsed.data.dataNascimento).toISOString().slice(0, 10);

  if (!user || !nascOk) {
    return { error: "Dados não conferem. Verifique e tente novamente." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(novaSenha, 10) },
  });

  return { ok: true };
}
