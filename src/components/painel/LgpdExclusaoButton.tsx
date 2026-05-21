"use client";

import { useActionState } from "react";
import {
  solicitarExclusaoAction,
  type AcaoState,
} from "@/server/cliente-actions";

const inicial: AcaoState = {};

export function LgpdExclusaoButton() {
  const [state, action] = useActionState(solicitarExclusaoAction, inicial);

  if (state.ok) {
    return (
      <p className="text-xs text-verde">
        Solicitação registrada. Processaremos a exclusão dos seus dados.
      </p>
    );
  }

  return (
    <form action={action}>
      <button
        type="submit"
        className="text-xs text-texto/60 underline hover:text-erro"
      >
        Solicitar exclusão dos meus dados (LGPD)
      </button>
      {state.error ? (
        <span className="ml-2 text-xs text-erro">{state.error}</span>
      ) : null}
    </form>
  );
}
