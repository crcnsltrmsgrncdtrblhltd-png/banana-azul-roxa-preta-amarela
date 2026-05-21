import Link from "next/link";
import { cn } from "@/lib/cn";

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  baseParams: Record<string, string>;
}

function href(base: Record<string, string>, pagina: number): string {
  const next = new URLSearchParams(base);
  if (pagina <= 1) {
    next.delete("pagina");
  } else {
    next.set("pagina", String(pagina));
  }
  const qs = next.toString();
  return qs ? `/vaquejadas?${qs}` : "/vaquejadas";
}

export function Pagination({
  pagina,
  totalPaginas,
  baseParams,
}: PaginationProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {paginas.map((p) => (
        <Link
          key={p}
          href={href(baseParams, p)}
          aria-current={p === pagina ? "page" : undefined}
          className={cn(
            "min-w-9 rounded px-3 py-1.5 text-center text-sm transition-colors",
            p === pagina
              ? "bg-amarelo text-escuro-900"
              : "bg-escuro text-white hover:bg-escuro-900",
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
