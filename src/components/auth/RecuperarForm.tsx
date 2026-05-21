"use client";

import { useActionState } from "react";
import Link from "next/link";
import { recuperarAction, type FormState } from "@/server/auth-actions";
import { Field } from "@/components/auth/Field";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inicial: FormState = {};

export function RecuperarForm() {
  const [state, action] = useActionState(recuperarAction, inicial);

  if (state.ok) {
    return (
      <div className="space-y-4 text-center">
        <p role="alert" className="text-sm text-verde">
          Senha redefinida com sucesso.
        </p>
        <Link
          href="/cliente/login"
          className="inline-block text-sm text-azul hover:underline"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <p className="text-sm text-texto/70">
        Confirme seus dados cadastrais para definir uma nova senha.
      </p>
      <Field label="Nome cadastrado" name="nome" autoComplete="name" />
      <Field label="CPF/CNPJ" name="cpfCnpj" placeholder="Somente números" />
      <Field label="Data de nascimento" name="dataNascimento" type="date" />
      <Field
        label="Nova senha"
        name="novaSenha"
        type="password"
        autoComplete="new-password"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-erro">
          {state.error}
        </p>
      ) : null}

      <SubmitButton variant="azul">Redefinir senha</SubmitButton>

      <p className="text-center text-sm">
        <Link href="/cliente/login" className="text-azul hover:underline">
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}
