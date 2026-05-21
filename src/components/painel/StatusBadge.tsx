import { cn } from "@/lib/cn";

const CORES: Record<string, string> = {
  PAGO: "bg-verde/15 text-verde",
  PENDENTE: "bg-amarelo/20 text-amarelo-escuro",
  CANCELADO: "bg-erro/15 text-erro",
  REEMBOLSADO: "bg-azul/15 text-azul",
  DISPONIVEL: "bg-verde/15 text-verde",
  RESERVADA: "bg-amarelo/20 text-amarelo-escuro",
  VENDIDA: "bg-escuro/10 text-escuro",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded px-2 py-0.5 font-display text-[11px] font-semibold uppercase tracking-wide",
        CORES[status] ?? "bg-escuro/10 text-escuro",
      )}
    >
      {status}
    </span>
  );
}
