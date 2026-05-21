"use client";

import { cn } from "@/lib/cn";

interface SenhaGridProps {
  total: number;
  disponiveis: Set<number>;
  selecionado: number | null;
  onSelecionar: (numero: number) => void;
}

export function SenhaGrid({
  total,
  disponiveis,
  selecionado,
  onSelecionar,
}: SenhaGridProps) {
  const numeros = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-verde" />
          Senhas disponíveis para compra
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-erro" />
          Senhas feitas
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(2.2rem,1fr))] gap-1">
        {numeros.map((n) => {
          const disponivel = disponiveis.has(n);
          const ativo = selecionado === n;

          return (
            <button
              key={n}
              type="button"
              disabled={!disponivel}
              onClick={() => disponivel && onSelecionar(n)}
              className={cn(
                "flex h-8 items-center justify-center rounded-sm text-xs font-semibold transition-all",
                disponivel
                  ? ativo
                    ? "bg-azul text-white ring-2 ring-azul ring-offset-1"
                    : "bg-verde text-white hover:brightness-110"
                  : "bg-erro/80 text-white/70 cursor-not-allowed",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
