"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/server/auth-actions";
import { Field } from "@/components/auth/Field";
import { SubmitButton } from "@/components/auth/SubmitButton";

interface RoleLoginFormProps {
  redirectTo: string;
  identificadorLabel?: string;
  botao?: string;
}

const inicial: FormState = {};

export function RoleLoginForm({
  redirectTo,
  identificadorLabel = "E-mail",
  botao = "Acessar",
}: RoleLoginFormProps) {
  const [state, action] = useActionState(loginAction, inicial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      <Field
        label={identificadorLabel}
        name="identificador"
        autoComplete="username"
      />
      <Field
        label="Senha cadastrada"
        name="senha"
        type="password"
        autoComplete="current-password"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-erro">
          {state.error}
        </p>
      ) : null}

      <SubmitButton variant="amarelo">{botao}</SubmitButton>
    </form>
  );
}
