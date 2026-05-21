import type { Metadata } from "next";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { AdminNav } from "@/components/painel/AdminNav";
import { listarParquesAdmin } from "@/server/admin-queries";

export const metadata: Metadata = { title: "Parques — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminParquesPage() {
  const session = await auth();
  const parques = await listarParquesAdmin();

  return (
    <PainelShell titulo="Administração" usuario={session?.user.name ?? ""}>
      <AdminNav />
      <h1 className="mb-6 font-display text-2xl font-semibold uppercase text-escuro">
        Parques
      </h1>
      <div className="overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-fundo text-left font-display uppercase text-escuro">
            <tr>
              <th className="px-4 py-3">Parque</th>
              <th className="px-4 py-3">Local</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Eventos</th>
            </tr>
          </thead>
          <tbody>
            {parques.map((p) => (
              <tr key={p.id} className="border-t border-black/10">
                <td className="px-4 py-3">{p.nome}</td>
                <td className="px-4 py-3">
                  {p.cidade ?? "—"}
                  {p.uf ? ` - ${p.uf}` : ""}
                </td>
                <td className="px-4 py-3">
                  {p.usuario.email ?? p.usuario.telefone}
                </td>
                <td className="px-4 py-3">{p._count.eventos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PainelShell>
  );
}
