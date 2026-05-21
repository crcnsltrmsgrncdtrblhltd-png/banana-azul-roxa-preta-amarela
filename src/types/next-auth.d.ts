import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";
import type { TipoUsuario } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tipo: TipoUsuario;
    } & DefaultSession["user"];
  }

  interface User {
    tipo: TipoUsuario;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    tipo: TipoUsuario;
  }
}
