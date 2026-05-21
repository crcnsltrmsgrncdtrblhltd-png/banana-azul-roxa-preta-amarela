"use client";

import { useActionState } from "react";
import { criarEventoAction, type AcaoState } from "@/server/parque-actions";
import { Field } from "@/components/auth/Field";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inicial: AcaoState = {};

export function NovoEventoForm() {
  const [state, action] = useActionState(criarEventoAction, inicial);

  return (
    <form
      action={action}
      className="space-y-4 rounded border border-black/10 bg-white p-6"
    >
      <Field label="Nome do evento" name="nome" />
      <div className="grid grid-cols-[1fr_5rem] gap-3">
        <Field label="Cidade" name="cidade" />
        <Field label="UF" name="uf" placeholder="CE" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Início" name="dataInicio" type="date" />
        <Field label="Fim" name="dataFim" type="date" />
        <Field
          label="Encerra venda"
          name="vendaEncerraEm"
          type="datetime-local"
        />
      </div>
      <Field
        label="Senhas por categoria/dia"
        name="senhasPorGrupo"
        type="number"
        defaultValue="10"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-erro">
          {state.error}
        </p>
      ) : null}

      <div className="w-48">
        <SubmitButton variant="verde">Criar evento</SubmitButton>
      </div>
    </form>
  );
}
