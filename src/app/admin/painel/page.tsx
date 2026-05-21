import type { Metadata } from "next";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { AdminNav } from "@/components/painel/AdminNav";
import { getAdminOverview } from "@/server/admin-queries";
import { moeda } from "@/lib/format";

export const metadata: Metadata = { title: "Painel Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPainelPage() {
  const session = await auth();
  const o = await getAdminOverview();

  const cards = [
    { label: "Parques", valor: String(o.parques) },
    { label: "Eventos", valor: String(o.eventos) },
    { label: "Senhas vendidas", valor: String(o.senhasVendidas) },
    { label: "Pedidos pagos", valor: String(o.pedidosPagos) },
    { label: "Usuários", valor: String(o.usuarios) },
    { label: "Reembolsos", valor: String(o.reembolsos) },
    { label: "Receita", valor: moeda(o.receita) },
  ];

  return (
    <PainelShell titulo="Administração" usuario={session?.user.name ?? ""}>
      <AdminNav />
      <h1 className="mb-6 font-display text-2xl font-semibold uppercase text-escuro">
        Visão geral
      </h1>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded border border-black/10 bg-white p-5 text-center"
          >
            <p className="font-display text-2xl font-semibold text-escuro">
              {c.valor}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-texto/70">
              {c.label}
            </p>
          </div>
        ))}
      </div>
    </PainelShell>
  );
}
