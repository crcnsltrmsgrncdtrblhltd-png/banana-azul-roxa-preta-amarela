import Link from "next/link";
import { cn } from "@/lib/cn";

type Periodo = "esse-mes" | "proximo-mes";

interface MonthFilterProps {
  ativo?: Periodo;
  baseParams: Record<string, string>;
}

const OPCOES: { valor: Periodo; label: string }[] = [
  { valor: "esse-mes", label: "Esse mês" },
  { valor: "proximo-mes", label: "Próximo mês" },
];

function montarHref(
  base: Record<string, string>,
  periodo: Periodo,
  remover: boolean,
): string {
  const next = new URLSearchParams(base);
  if (remover) {
    next.delete("periodo");
  } else {
    next.set("periodo", periodo);
  }
  next.delete("pagina");
  const qs = next.toString();
  return qs ? `/vaquejadas?${qs}` : "/vaquejadas";
}

export function MonthFilter({ ativo, baseParams }: MonthFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      {OPCOES.map((op) => {
        const isAtivo = ativo === op.valor;
        return (
          <Link
            key={op.valor}
            href={montarHref(baseParams, op.valor, isAtivo)}
            className={cn(
              "rounded border px-4 py-2 text-sm transition-colors",
              isAtivo
                ? "border-azul bg-azul text-white"
                : "border-black/15 bg-white hover:border-azul",
            )}
          >
            {op.label}
          </Link>
        );
      })}
    </div>
  );
}
