import type { Metadata } from "next";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { AdminNav } from "@/components/painel/AdminNav";
import { StatusEventoForm } from "@/components/painel/StatusEventoForm";
import { listarEventosAdmin } from "@/server/admin-queries";
import { dataCurta } from "@/lib/format";

export const metadata: Metadata = { title: "Eventos — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminEventosPage() {
  const session = await auth();
  const eventos = await listarEventosAdmin();

  return (
    <PainelShell titulo="Administração" usuario={session?.user.name ?? ""}>
      <AdminNav />
      <h1 className="mb-6 font-display text-2xl font-semibold uppercase text-escuro">
        Eventos
      </h1>
      <div className="overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-fundo text-left font-display uppercase text-escuro">
            <tr>
              <th className="px-4 py-3">Evento</th>
              <th className="px-4 py-3">Parque</th>
              <th className="px-4 py-3">Local</th>
              <th className="px-4 py-3">Início</th>
              <th className="px-4 py-3">Senhas</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e) => (
              <tr key={e.id} className="border-t border-black/10">
                <td className="px-4 py-3">{e.nome}</td>
                <td className="px-4 py-3">{e.parque.nome}</td>
                <td className="px-4 py-3">
                  {e.cidade} - {e.uf}
                </td>
                <td className="px-4 py-3">
                  {dataCurta(e.dataInicio.toISOString())}
                </td>
                <td className="px-4 py-3">{e._count.senhas}</td>
                <td className="px-4 py-3">
                  <StatusEventoForm eventoId={e.id} status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PainelShell>
  );
}
