"use client";

import { useActionState } from "react";
import Link from "next/link";
import { cadastrarAction, type FormState } from "@/server/auth-actions";
import { Field } from "@/components/auth/Field";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inicial: FormState = {};

export function CadastroForm() {
  const [state, action] = useActionState(cadastrarAction, inicial);

  return (
    <form action={action} className="space-y-4">
      <Field
        label="Nome completo / Razão Social"
        name="nome"
        autoComplete="name"
      />
      <MaskedInput
        mascara="telefone"
        label="Telefone"
        name="telefone"
        placeholder="(00) 00000-0000"
        autoComplete="tel"
      />
      <MaskedInput
        mascara="cpfcnpj"
        label="CPF/CNPJ"
        name="cpfCnpj"
        placeholder="000.000.000-00"
      />
      <Field
        label="Data de nascimento"
        name="dataNascimento"
        type="date"
      />
      <Field
        label="Crie uma senha"
        name="senha"
        type="password"
        autoComplete="new-password"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-erro">
          {state.error}
        </p>
      ) : null}

      <SubmitButton variant="verde">Cadastrar</SubmitButton>

      <p className="text-center text-sm text-texto/70">
        Já tem conta?{" "}
        <Link href="/cliente/login" className="text-azul hover:underline">
          Fazer login
        </Link>
      </p>
    </form>
  );
}
