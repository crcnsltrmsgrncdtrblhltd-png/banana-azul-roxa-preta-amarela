import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { NovoEventoForm } from "@/components/painel/NovoEventoForm";

export const metadata: Metadata = { title: "Novo evento" };
export const dynamic = "force-dynamic";

export default async function NovoEventoPage() {
  const session = await auth();

  return (
    <PainelShell titulo="Painel do Parque" usuario={session?.user.name ?? ""}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-escuro">
          Novo evento
        </h1>
        <Link
          href="/parque/painel"
          className="text-sm text-azul hover:underline"
        >
          Voltar
        </Link>
      </div>
      <div className="max-w-2xl">
        <NovoEventoForm />
      </div>
    </PainelShell>
  );
}
