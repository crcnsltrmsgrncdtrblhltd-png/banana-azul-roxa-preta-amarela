import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { CadastroForm } from "@/components/auth/CadastroForm";

export const metadata: Metadata = {
  title: "Cadastro",
  description:
    "Sua Senha para realizar a venda de senhas antecipadas. Crie sua conta agora.",
};

export default function CadastroPage() {
  return (
    <AuthShell titulo="Criar conta">
      <CadastroForm />
    </AuthShell>
  );
}
