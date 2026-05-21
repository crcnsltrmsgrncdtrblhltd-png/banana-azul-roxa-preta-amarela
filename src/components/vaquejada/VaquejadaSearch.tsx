"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export function VaquejadaSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [valor, setValor] = useState(params.get("busca") ?? "");
  const [, startTransition] = useTransition();

  function aplicar(busca: string) {
    const next = new URLSearchParams(params.toString());
    if (busca.trim()) {
      next.set("busca", busca.trim());
    } else {
      next.delete("busca");
    }
    next.delete("pagina");
    startTransition(() => {
      router.replace(`/vaquejadas?${next.toString()}`);
    });
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        aplicar(valor);
      }}
      className="relative"
    >
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/50"
        aria-hidden
      />
      <input
        type="search"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Digite qual vaquejada você procura"
        aria-label="Buscar vaquejada"
        className="w-full rounded border border-black/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-azul"
      />
    </form>
  );
}
