import { z } from "zod";
import { documentoValido } from "@/lib/documento";

export const cadastroSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo ou razão social"),
  telefone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  cpfCnpj: z
    .string()
    .trim()
    .min(1, "Informe o CPF/CNPJ")
    .refine(documentoValido, "CPF/CNPJ inválido"),
  dataNascimento: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Data de nascimento inválida"),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;

export const loginSchema = z.object({
  identificador: z.string().trim().min(3, "Informe e-mail, CPF/CNPJ ou telefone"),
  senha: z.string().min(1, "Informe a senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const recuperarSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome cadastrado"),
  cpfCnpj: z.string().trim().refine(documentoValido, "CPF/CNPJ inválido"),
  dataNascimento: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Data inválida"),
});

export type RecuperarInput = z.infer<typeof recuperarSchema>;
