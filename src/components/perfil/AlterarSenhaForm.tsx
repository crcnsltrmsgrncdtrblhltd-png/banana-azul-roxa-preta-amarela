"use client";

import { useActionState } from "react";
import { alterarSenhaAction, type PerfilState } from "@/server/perfil-actions";
import { Field } from "@/components/auth/Field";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inicial: PerfilState = {};

export function AlterarSenhaForm() {
  const [state, action] = useActionState(alterarSenhaAction, inicial);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="w-64">
        <Field label="Nova senha" name="novaSenha" type="password" />
      </div>
      <div className="w-40">
        <SubmitButton variant="verde">Alterar senha do LOGIN</SubmitButton>
      </div>
      {state.ok ? <span className="text-sm text-verde">Senha alterada.</span> : null}
      {state.error ? <span className="text-sm text-erro">{state.error}</span> : null}
    </form>
  );
}
