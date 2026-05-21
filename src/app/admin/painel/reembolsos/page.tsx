import type { Metadata } from "next";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { AdminNav } from "@/components/painel/AdminNav";
import { StatusBadge } from "@/components/painel/StatusBadge";
import { ReembolsoDecisao } from "@/components/painel/ReembolsoDecisao";
import { listarReembolsosAdmin } from "@/server/admin-queries";
import { moeda, dataCurta } from "@/lib/format";

export const metadata: Metadata = { title: "Reembolsos — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminReembolsosPage() {
  const session = await auth();
  const reembolsos = await listarReembolsosAdmin();

  return (
    <PainelShell titulo="Administração" usuario={session?.user.name ?? ""}>
      <AdminNav />
      <h1 className="mb-6 font-display text-2xl font-semibold uppercase text-escuro">
        Reembolsos
      </h1>
      {reembolsos.length === 0 ? (
        <p className="rounded border border-black/10 bg-white p-6 text-sm text-texto/70">
          Nenhuma solicitação de reembolso.
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-fundo text-left font-display uppercase text-escuro">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {reembolsos.map((r) => (
                <tr key={r.id} className="border-t border-black/10">
                  <td className="px-4 py-3">{r.pedido.usuario.nome}</td>
                  <td className="px-4 py-3">{r.motivo}</td>
                  <td className="px-4 py-3">
                    {moeda(Number(r.valorEstornado ?? r.pedido.total))}
                  </td>
                  <td className="px-4 py-3">
                    {dataCurta(r.criadoEm.toISOString())}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "SOLICITADO" ? (
                      <ReembolsoDecisao reembolsoId={r.id} />
                    ) : (
                      <span className="text-xs text-texto/50">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PainelShell>
  );
}
