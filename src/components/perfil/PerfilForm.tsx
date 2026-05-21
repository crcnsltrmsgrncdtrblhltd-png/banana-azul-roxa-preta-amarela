"use client";

import { useActionState } from "react";
import { atualizarPerfilAction, type PerfilState } from "@/server/perfil-actions";
import { Field } from "@/components/auth/Field";
import { SubmitButton } from "@/components/auth/SubmitButton";

interface PerfilFormProps {
  nome: string;
  cpfCnpj: string;
  dataNascimento: string;
  email: string;
  telefone: string;
}

const inicial: PerfilState = {};

export function PerfilForm(props: PerfilFormProps) {
  const [state, action] = useActionState(atualizarPerfilAction, inicial);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Nome/Razão Social" name="nome" defaultValue={props.nome} />
        <div>
          <span className="mb-1 block text-sm font-medium text-escuro">CPF/CNPJ</span>
          <input
            value={props.cpfCnpj}
            disabled
            className="w-full rounded border border-black/10 bg-fundo px-3 py-2.5 text-sm text-texto/60"
          />
        </div>
        <div>
          <span className="mb-1 block text-sm font-medium text-escuro">Data de Nascimento</span>
          <input
            value={props.dataNascimento}
            disabled
            className="w-full rounded border border-black/10 bg-fundo px-3 py-2.5 text-sm text-texto/60"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="E-mail" name="email" type="email" required={false} defaultValue={props.email} placeholder="Digite seu email" />
        <Field label="Telefone" name="telefone" type="tel" defaultValue={props.telefone} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Field label="CEP" name="cep" required={false} />
        <Field label="Rua" name="rua" required={false} />
        <Field label="Número" name="numero" required={false} />
        <Field label="Bairro" name="bairro" required={false} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="UF" name="uf" required={false} placeholder="BA" />
        <Field label="Cidade" name="cidade" required={false} />
        <div />
      </div>

      {state.error ? <p role="alert" className="text-sm text-erro">{state.error}</p> : null}
      {state.ok ? <p className="text-sm text-verde">Dados atualizados com sucesso.</p> : null}

      <div className="w-56">
        <SubmitButton variant="verde">Alterar meus dados</SubmitButton>
      </div>
    </form>
  );
}
