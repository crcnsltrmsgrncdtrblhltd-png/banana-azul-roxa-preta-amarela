"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RefreshButton() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(id);
  }, [router]);

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="rounded border border-black/15 px-4 py-2 font-display text-xs uppercase tracking-wide text-escuro hover:bg-escuro hover:text-white"
    >
      Atualizar status
    </button>
  );
}
