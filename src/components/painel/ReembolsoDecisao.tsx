"use client";

import { useActionState } from "react";
import {
  decidirReembolsoAction,
  type AcaoState,
} from "@/server/admin-actions";

const inicial: AcaoState = {};

export function ReembolsoDecisao({
  reembolsoId,
}: {
  reembolsoId: string;
}) {
  const [state, action] = useActionState(decidirReembolsoAction, inicial);

  if (state.ok) {
    return <span className="text-xs text-verde">Decisão registrada</span>;
  }

  return (
    <form action={action} className="flex gap-2">
      <input type="hidden" name="reembolsoId" value={reembolsoId} />
      <button
        type="submit"
        name="decisao"
        value="PROCESSADO"
        className="rounded bg-verde px-3 py-1 font-display text-[11px] uppercase text-white hover:bg-verde-escuro"
      >
        Processar
      </button>
      <button
        type="submit"
        name="decisao"
        value="NEGADO"
        className="rounded bg-erro px-3 py-1 font-display text-[11px] uppercase text-white"
      >
        Negar
      </button>
      {state.error ? (
        <span className="text-xs text-erro">{state.error}</span>
      ) : null}
    </form>
  );
}
