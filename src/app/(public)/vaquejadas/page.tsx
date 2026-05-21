import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { StateFilter } from "@/components/vaquejada/StateFilter";
import { MonthFilter } from "@/components/vaquejada/MonthFilter";
import { VaquejadaSearch } from "@/components/vaquejada/VaquejadaSearch";
import { EventCard } from "@/components/vaquejada/EventCard";
import { listarVaquejadas } from "@/server/eventos";
import { ESTADOS_VAQUEJADA, type UF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Vaquejadas",
  description:
    "Conheça as melhores e maiores vaquejadas do brasil, acesse e garanta sua senha antecipada.",
};

type Periodo = "esse-mes" | "proximo-mes";

function parseUf(valor?: string): UF | undefined {
  return ESTADOS_VAQUEJADA.find((uf) => uf === valor);
}

function parsePeriodo(valor?: string): Periodo | undefined {
  return valor === "esse-mes" || valor === "proximo-mes" ? valor : undefined;
}

export default async function VaquejadasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const uf = parseUf(typeof sp.uf === "string" ? sp.uf : undefined);
  const busca = typeof sp.busca === "string" ? sp.busca : undefined;
  const periodo = parsePeriodo(
    typeof sp.periodo === "string" ? sp.periodo : undefined,
  );
  const pagina = Number(typeof sp.pagina === "string" ? sp.pagina : 1) || 1;

  const resultado = await listarVaquejadas({ uf, busca, periodo, pagina });

  const baseParams: Record<string, string> = {};
  if (uf) baseParams.uf = uf;
  if (busca) baseParams.busca = busca;
  if (periodo) baseParams.periodo = periodo;

  return (
    <Container className="py-8">
      <div className="rounded-md bg-white p-4 shadow-sm md:p-8">
        <h1 className="text-center text-2xl font-semibold uppercase tracking-wide text-escuro">
          Vaquejadas
        </h1>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-5">
            <VaquejadaSearch />
            <div>
              <p className="mb-3 text-center font-display text-sm uppercase tracking-wide text-escuro">
                Qual o estado da vaquejada?
              </p>
              <StateFilter ativo={uf ?? "todos"} />
            </div>
          </div>
          <MonthFilter ativo={periodo} baseParams={baseParams} />
        </div>

        <hr className="my-8 border-black/10" />

        {resultado.itens.length === 0 ? (
          <p className="py-12 text-center text-texto/70">
            Nenhuma vaquejada encontrada com os filtros selecionados.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resultado.itens.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Pagination
            pagina={resultado.pagina}
            totalPaginas={resultado.totalPaginas}
            baseParams={baseParams}
          />
        </div>
      </div>
    </Container>
  );
}
