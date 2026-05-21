import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import type { TipoUsuario } from "@/generated/prisma/client";

interface RegraRota {
  prefixo: string;
  tipo: TipoUsuario;
  login: string;
}

const REGRAS: RegraRota[] = [
  { prefixo: "/cliente/painel", tipo: "CLIENTE", login: "/cliente/login" },
  { prefixo: "/parque/painel", tipo: "PARQUE", login: "/parque" },
  { prefixo: "/admin/painel", tipo: "ADMIN", login: "/admin" },
];

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/cliente/login" },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.tipo = user.tipo;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.tipo = token.tipo;
      return session;
    },
    authorized: ({ auth, request }) => {
      const { pathname } = request.nextUrl;
      const regra = REGRAS.find((r) => pathname.startsWith(r.prefixo));
      if (!regra) {
        return true;
      }

      if (!auth?.user) {
        const url = new URL(regra.login, request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }

      if (auth.user.tipo !== regra.tipo) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
