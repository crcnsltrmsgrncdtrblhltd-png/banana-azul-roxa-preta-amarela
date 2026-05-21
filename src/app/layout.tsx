import type { Metadata } from "next";
import { Oswald, Roboto, Roboto_Slab } from "next/font/google";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://banana-azul-roxa-preta-amarela.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Sua Senha — Home — Senha antecipada para vaquejada",
    template: "%s | Sua Senha",
  },
  description:
    "O Sua Senha foi criado com o principal objetivo de facilitar a vaquejada brasileira. Somos o mais moderno sistema para gestão de senhas (inscrições) em vaquejadas de qualquer porte.",
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/brand/favicon.png" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Sua Senha",
    title: "Sua Senha — Senha antecipada para vaquejada",
    description:
      "Plataforma de venda antecipada de senhas para vaquejadas. Compre sua senha online com segurança.",
    url: SITE_URL,
    images: [{ url: "/brand/logo.png", width: 512, height: 512, alt: "Sua Senha" }],
  },
  twitter: {
    card: "summary",
    title: "Sua Senha — Senha antecipada para vaquejada",
    description:
      "Compre senhas antecipadas para vaquejadas de qualquer porte.",
    images: ["/brand/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${oswald.variable} ${roboto.variable} ${robotoSlab.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
