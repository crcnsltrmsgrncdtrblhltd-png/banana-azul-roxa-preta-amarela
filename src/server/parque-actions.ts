"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { CATEGORIA_PADRAO } from "@/lib/constants";

export interface AcaoState {
  error?: string;
}

const PRECO_PADRAO: Record<string, number> = {
  Profissional: 1200,
  Amador: 900,
  Aspirante: 700,
  Master: 800,
  Jovem: 500,
  Feminina: 600,
};

const novoEventoSchema = z
  .object({
    nome: z.string().trim().min(3, "Informe o nome do evento"),
    cidade: z.string().trim().min(2, "Informe a cidade"),
    uf: z.string().trim().length(2, "UF inválida"),
    dataInicio: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Data inválida"),
    dataFim: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Data inválida"),
    vendaEncerraEm: z
      .string()
      .refine((v) => !Number.isNaN(Date.parse(v)), "Data inválida"),
    senhasPorGrupo: z.coerce.number().int().min(1).max(50).default(10),
  })
  .refine((d) => Date.parse(d.dataFim) >= Date.parse(d.dataInicio), {
    message: "Data fim deve ser após o início",
    path: ["dataFim"],
  });

function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function criarEventoAction(
  _prev: AcaoState,
  formData: FormData,
): Promise<AcaoState> {
  const session = await auth();
  if (!session?.user || session.user.tipo !== "PARQUE") {
    return { error: "Não autorizado." };
  }

  const parque = await prisma.parque.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!parque) {
    return { error: "Parque não encontrado." };
  }

  const parsed = novoEventoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const d = parsed.data;

  const evento = await prisma.evento.create({
    data: {
      slug: slugify(d.nome),
      nome: d.nome,
      parqueId: parque.id,
      cidade: d.cidade,
      uf: d.uf.toUpperCase(),
      dataInicio: new Date(d.dataInicio),
      dataFim: new Date(d.dataFim),
      vendaEncerraEm: new Date(d.vendaEncerraEm),
      status: "PUBLICADO",
      descricao: "Venda antecipada de senhas.",
    },
  });

  const inicio = new Date(d.dataInicio);
  const dias = await Promise.all(
    ["1º dia", "2º dia", "Final"].map((label, idx) =>
      prisma.diaEvento.create({
        data: {
          eventoId: evento.id,
          label,
          data: new Date(inicio.getTime() + idx * 86_400_000),
        },
      }),
    ),
  );

  for (const nome of CATEGORIA_PADRAO) {
    const categoria = await prisma.categoria.create({
      data: {
        eventoId: evento.id,
        nome,
        regras: `Categoria ${nome} conforme regulamento do evento.`,
        preco: PRECO_PADRAO[nome] ?? 700,
      },
    });
    await prisma.senha.createMany({
      data: dias.flatMap((dia) =>
        Array.from({ length: d.senhasPorGrupo }, (_, n) => ({
          eventoId: evento.id,
          categoriaId: categoria.id,
          diaId: dia.id,
          numero: n + 1,
          status: "DISPONIVEL" as const,
        })),
      ),
    });
  }

  revalidatePath("/parque/painel");
  redirect(`/parque/painel/evento/${evento.id}`);
}
