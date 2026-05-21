import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Escolha como você quer fazer o Login. Fazer login com CPF, e-mail ou telefone.",
};

export default function LoginPage() {
  return (
    <AuthShell titulo="Acessar minha conta">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
