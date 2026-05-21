"use client";

import { useActionState } from "react";
import {
  alterarStatusEventoAction,
  type AcaoState,
} from "@/server/admin-actions";

const inicial: AcaoState = {};
const OPCOES = ["RASCUNHO", "PUBLICADO", "ENCERRADO"] as const;

interface StatusEventoFormProps {
  eventoId: number;
  status: string;
}

export function StatusEventoForm({ eventoId, status }: StatusEventoFormProps) {
  const [state, action] = useActionState(alterarStatusEventoAction, inicial);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="eventoId" value={eventoId} />
      <select
        name="status"
        defaultValue={status}
        className="rounded border border-black/15 px-2 py-1 text-xs"
      >
        {OPCOES.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded bg-escuro px-3 py-1 font-display text-[11px] uppercase text-white hover:bg-escuro-900"
      >
        Salvar
      </button>
      {state.ok ? <span className="text-xs text-verde">✓</span> : null}
      {state.error ? (
        <span className="text-xs text-erro">{state.error}</span>
      ) : null}
    </form>
  );
}
