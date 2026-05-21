"use client";

import { useActionState } from "react";
import { editarSenhaAction, type AcaoState } from "@/server/cliente-actions";
import { Field } from "@/components/auth/Field";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { UfCidadeSelect } from "@/components/ui/UfCidadeSelect";
import { SubmitButton } from "@/components/auth/SubmitButton";

interface EditarSenhaFormProps {
  senhaId: string;
  vaqueiroNome: string;
  vaqueiroCpf: string;
  apelido: string;
  cidade: string;
  uf: string;
}

const inicial: AcaoState = {};

export function EditarSenhaForm(props: EditarSenhaFormProps) {
  const [state, action] = useActionState(editarSenhaAction, inicial);

  return (
    <details className="mt-2 rounded border border-black/10">
      <summary className="cursor-pointer px-3 py-2 text-sm text-azul">
        Editar dados do vaqueiro
      </summary>
      <form action={action} className="space-y-3 p-3">
        <input type="hidden" name="senhaId" value={props.senhaId} />
        <Field
          label="Nome do vaqueiro"
          name="vaqueiroNome"
          defaultValue={props.vaqueiroNome}
        />
        <MaskedInput
          mascara="cpfcnpj"
          label="CPF do vaqueiro"
          name="vaqueiroCpf"
          defaultValue={props.vaqueiroCpf}
          placeholder="000.000.000-00"
        />
        <Field
          label="Apelido"
          name="apelido"
          required={false}
          defaultValue={props.apelido}
        />
        <UfCidadeSelect defaultUf={props.uf} defaultCidade={props.cidade} />

        {state.error ? (
          <p role="alert" className="text-xs text-erro">
            {state.error}
          </p>
        ) : null}
        {state.ok ? (
          <p role="alert" className="text-xs text-verde">
            Dados atualizados.
          </p>
        ) : null}

        <div className="w-40">
          <SubmitButton variant="verde">Salvar</SubmitButton>
        </div>
      </form>
    </details>
  );
}
