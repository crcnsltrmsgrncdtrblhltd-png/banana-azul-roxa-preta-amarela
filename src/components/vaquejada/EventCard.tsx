import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { VaquejadaResumo } from "@/lib/types";
import { periodoEvento, encerramentoVenda } from "@/lib/format";

interface EventCardProps {
  evento: VaquejadaResumo;
}

export function EventCard({ evento }: EventCardProps) {
  const href = `/vaquejada/${evento.id}/${evento.slug}`;
  const encerrado = new Date(evento.vendaEncerraEm).getTime() < Date.now();

  return (
    <article className="flex min-h-[180px] overflow-hidden rounded-md bg-escuro-900 text-white shadow-md transition-shadow hover:shadow-xl">
      <Link
        href={href}
        className="relative w-32 shrink-0 bg-black sm:w-36"
        aria-hidden
        tabIndex={-1}
      >
        {evento.posterUrl ? (
          <img
            src={evento.posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex h-full items-center justify-center px-2 text-center font-display text-[10px] uppercase tracking-widest text-amarelo">
            Sua Senha
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link
          href={href}
          className="font-display text-sm font-semibold leading-tight hover:text-amarelo"
        >
          {evento.nome}
        </Link>

        <p className="flex items-center gap-1.5 text-xs text-white/70">
          <CalendarDays size={13} />
          {periodoEvento(evento.dataInicio, evento.dataFim)}
        </p>

        <p className="flex items-center gap-1.5 text-xs text-white/70">
          <MapPin size={13} />
          {evento.cidade} - {evento.uf}
        </p>

        {encerrado ? (
          <>
            <p className="mt-0.5 text-[11px] font-medium uppercase text-erro">
              Vendas encerrado dia {encerramentoVenda(evento.vendaEncerraEm)}
            </p>
            <Link
              href="/cliente/painel"
              className="mt-2 inline-flex items-center justify-center rounded border border-white/20 px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide text-white/80 transition-colors hover:bg-white/10"
            >
              Minhas senhas
            </Link>
          </>
        ) : (
          <>
            <p className="mt-0.5 text-[11px] font-medium uppercase text-amarelo">
              Vendas encerra no dia {encerramentoVenda(evento.vendaEncerraEm)}
            </p>
            <Link
              href={href}
              className="mt-2 inline-flex items-center justify-center rounded bg-amarelo px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide text-escuro-900 transition-colors hover:bg-amarelo-escuro"
            >
              Comprar Senha
            </Link>
          </>
        )}
      </div>
    </article>
  );
}
