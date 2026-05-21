import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { StatusBadge } from "@/components/painel/StatusBadge";
import { getParquePainel } from "@/server/parque-queries";

export const metadata: Metadata = { title: "Painel do Parque" };
export const dynamic = "force-dynamic";

export default async function ParquePainelPage() {
  const session = await auth();
  const dados = await getParquePainel(session?.user.id ?? "");

  return (
    <PainelShell titulo="Painel do Parque" usuario={session?.user.name ?? ""}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase text-escuro">
            {dados?.parque.nome ?? "Meu Parque"}
          </h1>
          <p className="text-sm text-texto/70">
            Gerencie seus eventos, categorias e vendas.
          </p>
        </div>
        <Link
          href="/parque/painel/novo"
          className="rounded bg-verde px-4 py-2 font-display text-sm uppercase text-white hover:bg-verde-escuro"
        >
          Novo evento
        </Link>
      </div>

      {!dados || dados.eventos.length === 0 ? (
        <p className="rounded border border-black/10 bg-white p-6 text-sm text-texto/70">
          Nenhum evento cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dados.eventos.map((e) => (
            <Link
              key={e.id}
              href={`/parque/painel/evento/${e.id}`}
              className="rounded border border-black/10 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="font-display font-semibold text-escuro">
                  {e.nome}
                </h2>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-sm text-texto/70">
                {e.cidade} - {e.uf}
              </p>
              <div className="mt-4 flex gap-4 text-sm">
                <span>
                  <strong className="text-verde">{e.vendidas}</strong> vendidas
                </span>
                <span>
                  <strong className="text-escuro">{e.disponiveis}</strong>{" "}
                  disponíveis
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PainelShell>
  );
}
