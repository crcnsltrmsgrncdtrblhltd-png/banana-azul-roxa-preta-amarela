import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { Container } from "@/components/ui/Container";
import { PerfilForm } from "@/components/perfil/PerfilForm";
import { AlterarSenhaForm } from "@/components/perfil/AlterarSenhaForm";

export const metadata: Metadata = { title: "Meus Dados" };
export const dynamic = "force-dynamic";

export default async function MeusDadosPage() {
  const session = await auth();
  if (!session?.user) redirect("/cliente/login?redirect=/cliente/meus-dados");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) redirect("/cliente/login");

  return (
    <Container className="py-8">
      <div className="rounded-md bg-white px-6 py-8 shadow-sm md:px-10">
        <h1 className="mb-6 text-center font-display text-xl font-semibold uppercase tracking-wide text-escuro">
          Atualizar meus dados
        </h1>

        <p className="mb-4 text-sm text-texto/70">
          Clique no botão se deseja alterar a senha do seu LOGIN.
        </p>

        <div className="mb-8 rounded border border-black/10 p-4">
          <AlterarSenhaForm />
        </div>

        <PerfilForm
          nome={user.nome}
          cpfCnpj={user.cpfCnpj}
          dataNascimento={user.dataNascimento.toISOString().slice(0, 10)}
          email={user.email ?? ""}
          telefone={user.telefone}
        />
      </div>
    </Container>
  );
}
