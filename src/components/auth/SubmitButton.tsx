"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

interface SubmitButtonProps {
  children: React.ReactNode;
  variant?: "verde" | "azul" | "amarelo";
}

const CORES = {
  verde: "bg-verde hover:bg-verde-escuro text-white",
  azul: "bg-azul hover:bg-azul-escuro text-white",
  amarelo: "bg-amarelo hover:bg-amarelo-escuro text-escuro-900",
};

export function SubmitButton({
  children,
  variant = "verde",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "w-full rounded px-5 py-2.5 font-display text-sm font-medium uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        CORES[variant],
      )}
    >
      {pending ? "Aguarde..." : children}
    </button>
  );
}
