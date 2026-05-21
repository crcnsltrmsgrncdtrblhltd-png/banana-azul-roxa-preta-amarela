import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RoleLoginForm } from "@/components/auth/RoleLoginForm";

export const metadata: Metadata = { title: "Área do Parque" };

export default function ParqueLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthShell
        titulo="Área restrita ao Parque"
        rodape={
          <Link href="/" className="text-azul hover:underline">
            Voltar ao site
          </Link>
        }
      >
        <p className="mb-4 text-center text-sm text-texto/70">
          Acesse com o e-mail e a senha cadastrados.
        </p>
        <RoleLoginForm
          redirectTo="/parque/painel"
          botao="Acessar área do parque"
        />
      </AuthShell>
    </div>
  );
}
