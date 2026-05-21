import type { Metadata } from "next";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { AdminNav } from "@/components/painel/AdminNav";
import { StatusBadge } from "@/components/painel/StatusBadge";
import { listarUsuariosAdmin } from "@/server/admin-queries";
import { dataCurta } from "@/lib/format";

export const metadata: Metadata = { title: "Usuários — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const session = await auth();
  const usuarios = await listarUsuariosAdmin();

  return (
    <PainelShell titulo="Administração" usuario={session?.user.name ?? ""}>
      <AdminNav />
      <h1 className="mb-6 font-display text-2xl font-semibold uppercase text-escuro">
        Usuários ({usuarios.length})
      </h1>
      <div className="overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-fundo text-left font-display uppercase text-escuro">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">CPF/CNPJ</th>
              <th className="px-4 py-3">Criado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t border-black/10">
                <td className="px-4 py-3">{u.nome}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={u.tipo} />
                </td>
                <td className="px-4 py-3">{u.email ?? u.telefone}</td>
                <td className="px-4 py-3">{u.cpfCnpj}</td>
                <td className="px-4 py-3">
                  {dataCurta(u.criadoEm.toISOString())}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PainelShell>
  );
}
