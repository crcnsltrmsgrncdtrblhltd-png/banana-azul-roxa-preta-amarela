import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { authConfig } from "@/auth.config";
import { loginSchema } from "@/lib/schemas";
import { normalizarDocumento } from "@/lib/documento";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identificador: {},
        senha: {},
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { identificador, senha } = parsed.data;
        const digitos = normalizarDocumento(identificador);

        const user = await prisma.user.findFirst({
          where: identificador.includes("@")
            ? { email: identificador.toLowerCase() }
            : { OR: [{ cpfCnpj: digitos }, { telefone: digitos }] },
        });

        if (!user) {
          return null;
        }

        const ok = await bcrypt.compare(senha, user.passwordHash);
        if (!ok) {
          return null;
        }

        return {
          id: user.id,
          name: user.nome,
          email: user.email ?? undefined,
          tipo: user.tipo,
        };
      },
    }),
  ],
});
