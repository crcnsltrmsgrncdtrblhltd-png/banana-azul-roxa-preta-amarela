import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://banana-azul-roxa-preta-amarela.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cliente/painel", "/parque/painel", "/admin/painel", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
