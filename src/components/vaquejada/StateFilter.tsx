import Link from "next/link";
import { ESTADOS_VAQUEJADA, type UF } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface StateFilterProps {
  ativo?: UF | "todos";
}

function pillClasses(isAtivo: boolean): string {
  return cn(
    "rounded px-3 py-1.5 font-display text-sm font-medium uppercase tracking-wide transition-colors",
    isAtivo
      ? "bg-amarelo text-escuro-900"
      : "bg-escuro text-white hover:bg-escuro-900",
  );
}

export function StateFilter({ ativo = "todos" }: StateFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {ESTADOS_VAQUEJADA.map((uf) => (
        <Link
          key={uf}
          href={`/vaquejadas?uf=${uf}`}
          className={pillClasses(ativo === uf)}
        >
          {uf}
        </Link>
      ))}
      <Link
        href="/vaquejadas"
        className={pillClasses(ativo === "todos")}
      >
        Todos Estados
      </Link>
    </div>
  );
}
