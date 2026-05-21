import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RoleLoginForm } from "@/components/auth/RoleLoginForm";

export const metadata: Metadata = { title: "Administração" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthShell
        titulo="Administração"
        rodape={
          <Link href="/" className="text-azul hover:underline">
            Voltar ao site
          </Link>
        }
      >
        <RoleLoginForm redirectTo="/admin/painel" botao="Acessar" />
      </AuthShell>
    </div>
  );
}
