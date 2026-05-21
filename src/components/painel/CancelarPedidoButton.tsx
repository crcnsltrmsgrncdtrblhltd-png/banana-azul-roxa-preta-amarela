"use client";

import { useActionState } from "react";
import {
  cancelarPedidoAction,
  type AcaoState,
} from "@/server/cliente-actions";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inicial: AcaoState = {};

export function CancelarPedidoButton({ pedidoId }: { pedidoId: string }) {
  const [state, action] = useActionState(cancelarPedidoAction, inicial);

  if (state.ok) {
    return (
      <p role="alert" className="text-sm text-verde">
        Reembolso processado.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="pedidoId" value={pedidoId} />
      <div className="w-44">
        <SubmitButton variant="azul">Cancelar e reembolsar</SubmitButton>
      </div>
      {state.error ? (
        <p role="alert" className="text-right text-xs text-erro">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
