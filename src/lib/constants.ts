export const SITE = {
  nome: "Sua Senha",
  cnpj: "29.823.843/0001-70",
  email: "contato@suasenha.com.br",
  whatsapp: "558898056755",
  ano: 2026,
} as const;

export const NAV_LINKS = [
  { label: "INÍCIO", href: "/" },
  { label: "QUEM SOMOS", href: "/quem-somos" },
  { label: "VAQUEJADAS", href: "/vaquejadas" },
  { label: "MINHAS SENHAS", href: "/cliente/painel" },
] as const;

export const ESTADOS_VAQUEJADA = [
  "AL",
  "BA",
  "CE",
  "GO",
  "MA",
  "MG",
  "PB",
  "PE",
  "PI",
  "TO",
] as const;

export type UF = (typeof ESTADOS_VAQUEJADA)[number];

export const CATEGORIA_PADRAO = [
  "Profissional",
  "Amador",
  "Aspirante",
  "Master",
  "Jovem",
  "Feminina",
] as const;

export type CategoriaNome = (typeof CATEGORIA_PADRAO)[number];
