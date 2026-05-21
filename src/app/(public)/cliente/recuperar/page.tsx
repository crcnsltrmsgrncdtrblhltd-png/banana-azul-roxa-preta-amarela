import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RecuperarForm } from "@/components/auth/RecuperarForm";

export const metadata: Metadata = { title: "Recuperar acesso" };

export default function RecuperarPage() {
  return (
    <AuthShell titulo="Recuperar acesso">
      <RecuperarForm />
    </AuthShell>
  );
}
