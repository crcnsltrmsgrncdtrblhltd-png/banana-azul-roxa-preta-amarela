"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { UfCidadeSelect } from "@/components/ui/UfCidadeSelect";
import { Field } from "@/components/auth/Field";
import { moeda } from "@/lib/format";

interface SenhaModalProps {
  categoriaNome: string;
  preco: number;
  numero: number;
  onFechar: () => void;
  onConfirmar: (dados: DadosSenha) => void;
}

export interface DadosSenha {
  vaqueiroNome: string;
  vaqueiroCpf: string;
  apelido: string;
  uf: string;
  cidade: string;
  cavaloPuxador: string;
  esteireiro: string;
  cavaloEsteireiro: string;
  representacao: string;
  boiNaTv: boolean;
  concordaReembolso: boolean;
}

const VALOR_BOI_TV = 20;

export function SenhaModal({
  categoriaNome,
  preco,
  numero,
  onFechar,
  onConfirmar,
}: SenhaModalProps) {
  const [cpfPreenchido, setCpfPreenchido] = useState(false);
  const [boiNaTv, setBoiNaTv] = useState(false);
  const [concordo, setConcordo] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onConfirmar({
      vaqueiroNome: String(fd.get("vaqueiroNome") ?? ""),
      vaqueiroCpf: String(fd.get("vaqueiroCpf") ?? ""),
      apelido: String(fd.get("apelido") ?? ""),
      uf: String(fd.get("uf") ?? ""),
      cidade: String(fd.get("cidade") ?? ""),
      cavaloPuxador: String(fd.get("cavaloPuxador") ?? ""),
      esteireiro: String(fd.get("esteireiro") ?? ""),
      cavaloEsteireiro: String(fd.get("cavaloEsteireiro") ?? ""),
      representacao: String(fd.get("representacao") ?? ""),
      boiNaTv,
      concordaReembolso: concordo,
    });
  }

  const valorTotal = boiNaTv ? preco + VALOR_BOI_TV : preco;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-12">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-escuro-900 px-5 py-3 text-white">
          <span className="text-sm">Dados da senha</span>
          <button type="button" onClick={onFechar} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <h2 className="mb-2 font-display text-xl font-semibold uppercase text-escuro">
            Categoria {categoriaNome}
          </h2>
          <p className="mb-4 text-xs font-medium text-erro">
            EVITE PROBLEMAS! Preencha o CPF com o dado do vaqueiro que irá
            correr a senha.
          </p>

          <div className="mb-4 grid gap-3 sm:grid-cols-5">
            <div
              onBlur={(e) => {
                const v = (e.target as HTMLInputElement).value?.replace(
                  /\D/g,
                  "",
                );
                if (v && v.length >= 11) setCpfPreenchido(true);
              }}
            >
              <MaskedInput
                mascara="cpfcnpj"
                label="CPF do vaqueiro"
                name="vaqueiroCpf"
                placeholder="000.000.000-00"
              />
            </div>
            <Field label="Nome completo do vaqueiro" name="vaqueiroNome" />
            <Field
              label="Nome chamado pela locução"
              name="apelido"
              required={false}
              placeholder="Apelido do Vaqueiro"
            />
            <div className="sm:col-span-2">
              <UfCidadeSelect />
            </div>
          </div>

          {cpfPreenchido ? (
            <>
              <div className="mb-4 rounded bg-escuro/90 px-4 py-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold">
                    1ª Senha - {moeda(valorTotal)}
                  </span>
                </div>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={boiNaTv}
                    onChange={(e) => setBoiNaTv(e.target.checked)}
                    className="accent-amarelo"
                  />
                  Boi na TV + {moeda(VALOR_BOI_TV)}
                  <span className="text-xs text-white/60">OPCIONAL</span>
                </label>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-4">
                <div>
                  <span className="mb-1 block text-sm font-medium text-escuro">
                    Nº da senha
                  </span>
                  <input
                    value={numero}
                    readOnly
                    className="w-full rounded border border-black/10 bg-fundo px-3 py-2.5 text-sm"
                  />
                </div>
                <Field
                  label="Cavalo puxador *"
                  name="cavaloPuxador"
                  placeholder="Nome do cavalo puxador"
                />
                <Field
                  label="Esteireiro"
                  name="esteireiro"
                  required={false}
                  placeholder="Nome do esteireiro"
                />
                <Field
                  label="Cavalo esteireiro"
                  name="cavaloEsteireiro"
                  required={false}
                  placeholder="Nome do cavalo esteireiro"
                />
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Field
                  label="Representação"
                  name="representacao"
                  required={false}
                  placeholder="Digite sua representação"
                />
                <div className="sm:col-span-2">
                  <UfCidadeSelect ufName="repUf" cidadeName="repCidade" />
                </div>
              </div>

              <div className="mb-4 space-y-2 border-t border-black/10 pt-4">
                <a
                  href="/politica-de-cancelamento"
                  target="_blank"
                  className="text-sm font-semibold text-azul hover:underline"
                >
                  LER POLÍTICA DE REEMBOLSO
                </a>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={concordo}
                    onChange={(e) => setConcordo(e.target.checked)}
                    className="accent-azul"
                  />
                  Declaro que li e concordo com a política de reembolso do site.
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onFechar}
                  className="flex-1 rounded bg-verde px-4 py-3 font-display text-sm font-semibold uppercase text-white hover:bg-verde-escuro"
                >
                  Fazer outra senha
                </button>
                <button
                  type="submit"
                  disabled={!concordo}
                  className="flex-1 rounded bg-amarelo px-4 py-3 font-display text-sm font-semibold uppercase text-escuro-900 hover:bg-amarelo-escuro disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Escolher forma de pagamento
                </button>
              </div>
            </>
          ) : null}
        </form>
      </div>
    </div>
  );
}
