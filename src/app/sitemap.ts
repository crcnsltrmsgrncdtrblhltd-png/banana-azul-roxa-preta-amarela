import type { MetadataRoute } from "next";
import { prisma } from "@/server/db";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://banana-azul-roxa-preta-amarela.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/vaquejadas`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/quem-somos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/como-funciona`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/cliente/login`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/cliente/cadastro`, changeFrequency: "monthly", priority: 0.4 },
    {
      url: `${BASE}/politica-de-privacidade`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE}/politica-de-cancelamento`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  let eventos: MetadataRoute.Sitemap = [];
  try {
    const lista = await prisma.evento.findMany({
      where: { status: "PUBLICADO" },
      select: { id: true, slug: true, atualizadoEm: true },
    });
    eventos = lista.map((e) => ({
      url: `${BASE}/vaquejada/${e.id}/${e.slug}`,
      lastModified: e.atualizadoEm,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB indisponível no build estático — retorna só estáticas
  }

  return [...estaticas, ...eventos];
}
