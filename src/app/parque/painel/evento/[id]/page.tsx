import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PainelShell } from "@/components/painel/PainelShell";
import { getEventoDoParque } from "@/server/parque-queries";
import { moeda, periodoEvento } from "@/lib/format";

export const metadata: Metadata = { title: "Evento" };
export const dynamic = "force-dynamic";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function ParqueEventoPage({ params }: PageParams) {
  const { id } = await params;
  const session = await auth();
  const dados = await getEventoDoParque(Number(id), session?.user.id ?? "");

  if (!dados) {
    notFound();
  }

  const { evento, receita } = dados;

  return (
    <PainelShell titulo="Painel do Parque" usuario={session?.user.name ?? ""}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase text-escuro">
            {evento.nome}
          </h1>
          <p className="text-sm text-texto/70">
            {evento.cidade} - {evento.uf} ·{" "}
            {periodoEvento(
              evento.dataInicio.toISOString(),
              evento.dataFim.toISOString(),
            )}
          </p>
        </div>
        <Link href="/parque/painel" className="text-sm text-azul hover:underline">
          Voltar
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-black/10 bg-white p-5 text-center">
          <p className="font-display text-3xl font-semibold text-escuro">
            {evento.senhas.length}
          </p>
          <p className="text-xs uppercase text-texto/70">Senhas vendidas</p>
        </div>
        <div className="rounded border border-black/10 bg-white p-5 text-center">
          <p className="font-display text-3xl font-semibold text-verde">
            {moeda(receita)}
          </p>
          <p className="text-xs uppercase text-texto/70">Receita</p>
        </div>
        <div className="rounded border border-black/10 bg-white p-5 text-center">
          <p className="font-display text-3xl font-semibold text-escuro">
            {evento.categorias.length}
          </p>
          <p className="text-xs uppercase text-texto/70">Categorias</p>
        </div>
      </div>

      <h2 className="mb-3 font-display text-lg font-semibold uppercase text-escuro">
        Vendas
      </h2>
      {evento.senhas.length === 0 ? (
        <p className="rounded border border-black/10 bg-white p-6 text-sm text-texto/70">
          Nenhuma senha vendida ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-fundo text-left font-display uppercase text-escuro">
              <tr>
                <th className="px-4 py-3">Nº</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Dia</th>
                <th className="px-4 py-3">Vaqueiro</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {evento.senhas.map((s) => (
                <tr key={s.id} className="border-t border-black/10">
                  <td className="px-4 py-3">{s.numero}</td>
                  <td className="px-4 py-3">{s.categoria.nome}</td>
                  <td className="px-4 py-3">{s.dia.label}</td>
                  <td className="px-4 py-3">
                    {s.vaqueiroNome ?? "—"}
                    {s.apelido ? ` "${s.apelido}"` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {s.cidade ?? "—"}
                    {s.uf ? `/${s.uf}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {moeda(Number(s.itemPedido?.valor ?? 0))}
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
