"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { comprarSenhaAction } from "@/server/compra";
import type { CompraState, Disponibilidade } from "@/server/compra-types";
import { AvisoModais } from "@/components/compra/AvisoModais";
import { SenhaGrid } from "@/components/compra/SenhaGrid";
import { SenhaModal, type DadosSenha } from "@/components/compra/SenhaModal";
import { moeda } from "@/lib/format";

interface InscricaoWizardProps {
  eventoId: number;
  eventoNome: string;
  eventoCidade: string;
  eventoUf: string;
  disponibilidade: Disponibilidade;
}

const inicial: CompraState = {};
const TOTAL_SENHAS = 175;

export function InscricaoWizard({
  eventoId,
  eventoNome,
  eventoCidade,
  eventoUf,
  disponibilidade,
}: InscricaoWizardProps) {
  const { categorias, dias, numeros } = disponibilidade;
  const [categoriaId, setCategoriaId] = useState<string>(
    categorias[0]?.id.toString() ?? "",
  );
  const [diaId, setDiaId] = useState<string>(dias[0]?.id.toString() ?? "");
  const [numero, setNumero] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [state, action] = useActionState(comprarSenhaAction, inicial);

  const categoria = categorias.find((c) => c.id === Number(categoriaId));
  const disponiveis = useMemo(
    () => new Set(numeros[`${categoriaId}:${diaId}`] ?? []),
    [categoriaId, diaId, numeros],
  );

  function aoSelecionarNumero(n: number) {
    setNumero(n);
    setModalAberto(true);
  }

  function aoConfirmarModal(dados: DadosSenha) {
    setModalAberto(false);
    const fd = new FormData();
    fd.set("eventoId", String(eventoId));
    fd.set("categoriaId", categoriaId);
    fd.set("diaId", diaId);
    fd.set("numero", String(numero));
    fd.set("metodo", "PIX");
    fd.set("parcelas", "1");
    fd.set("vaqueiroNome", dados.vaqueiroNome);
    fd.set("vaqueiroCpf", dados.vaqueiroCpf);
    fd.set("apelido", dados.apelido);
    fd.set("uf", dados.uf);
    fd.set("cidade", dados.cidade);
    fd.set("cavaloPuxador", dados.cavaloPuxador);
    fd.set("esteireiro", dados.esteireiro);
    fd.set("cavaloEsteireiro", dados.cavaloEsteireiro);
    fd.set("representacao", dados.representacao);
    fd.set("boiNaTv", dados.boiNaTv ? "true" : "false");
    action(fd);
  }

  if (state.error === "LOGIN_REQUIRED" && typeof window !== "undefined") {
    const redir = encodeURIComponent(window.location.pathname);
    window.location.href = `/cliente/login?redirect=${redir}`;
    return (
      <div className="rounded-md bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-texto/70">Redirecionando para login...</p>
      </div>
    );
  }

  if (state.ok && state.checkoutUrl) {
    if (typeof window !== "undefined") {
      window.location.href = state.checkoutUrl;
    }
    return (
      <div className="space-y-4 rounded-md bg-white p-8 text-center shadow-sm">
        <h2 className="font-display text-xl font-semibold uppercase text-amarelo">
          Redirecionando para pagamento...
        </h2>
        <p className="text-sm text-texto/70">
          Se não redirecionar,{" "}
          <a href={state.checkoutUrl} className="text-azul underline">
            clique aqui
          </a>
          .
        </p>
      </div>
    );
  }

  if (state.ok) {
    return (
      <div className="space-y-4 rounded-md bg-white p-8 text-center shadow-sm">
        <h2 className="font-display text-xl font-semibold uppercase text-verde">
          Senha confirmada!
        </h2>
        <p className="text-sm text-texto/70">
          Pedido <strong>{state.pedidoId}</strong> pago com sucesso.
        </p>
        <Link
          href="/cliente/painel"
          className="inline-block rounded bg-verde px-5 py-2.5 font-display text-sm uppercase text-white hover:bg-verde-escuro"
        >
          Ver Minhas Senhas
        </Link>
      </div>
    );
  }

  return (
    <AvisoModais>
      <div className="space-y-0">
        <div className="rounded-t-md bg-white p-6 shadow-sm">
          <h1 className="text-center font-display text-xl font-semibold uppercase text-escuro md:text-2xl">
            {eventoNome}
          </h1>
          <p className="text-center text-sm text-texto/60">
            {eventoCidade}/{eventoUf} - 2026
          </p>
        </div>

        <div className="bg-white px-6 pb-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-escuro">
                  Escolha a categoria
                </span>
                <select
                  value={categoriaId}
                  onChange={(e) => {
                    setCategoriaId(e.target.value);
                    setNumero(null);
                  }}
                  className="w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm"
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <h3 className="mb-2 font-display text-sm font-semibold uppercase text-escuro">
                Preço das Senhas
              </h3>
              {categoria ? (
                <div className="flex gap-3">
                  <div className="flex-1 rounded bg-escuro-900 p-3 text-white">
                    <p className="text-[10px] font-semibold uppercase text-white/60">
                      1ª Senha
                    </p>
                    <p className="text-xs">
                      Senha no site:{" "}
                      <strong className="text-amarelo">
                        {moeda(categoria.preco)}
                      </strong>
                    </p>
                    <p className="text-[10px] text-white/50">
                      Boi na TV: R$ 20,00
                    </p>
                  </div>
                  <div className="flex-1 rounded bg-escuro-900 p-3 text-white">
                    <p className="text-[10px] font-semibold uppercase text-white/60">
                      2ª Senha
                    </p>
                    <p className="text-xs">
                      Senha no site:{" "}
                      <strong className="text-amarelo">
                        {moeda(categoria.preco)}
                      </strong>
                    </p>
                    <p className="text-[10px] text-white/50">
                      Boi na TV: R$ 20,00
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-escuro/90 px-6 py-6 text-white">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-lg font-semibold uppercase">
              Mapa de Senhas
            </h2>
            <label className="block">
              <span className="mb-1 block text-xs text-white/70">
                Qual dia você quer correr?
              </span>
              <select
                value={diaId}
                onChange={(e) => {
                  setDiaId(e.target.value);
                  setNumero(null);
                }}
                className="rounded border border-white/20 bg-escuro-900 px-3 py-2 text-sm text-white"
              >
                {dias.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => setNumero(null)}
            className="mb-4 w-full rounded bg-azul py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-white hover:bg-azul-escuro"
          >
            Atualizar Mapa
          </button>

          <SenhaGrid
            total={TOTAL_SENHAS}
            disponiveis={disponiveis}
            selecionado={numero}
            onSelecionar={aoSelecionarNumero}
          />
        </div>

        {state.error && state.error !== "LOGIN_REQUIRED" ? (
          <div className="bg-white px-6 py-4">
            <p role="alert" className="text-sm text-erro">
              {state.error}
            </p>
          </div>
        ) : null}
      </div>

      {modalAberto && numero && categoria ? (
        <SenhaModal
          categoriaNome={categoria.nome}
          preco={categoria.preco}
          numero={numero}
          onFechar={() => setModalAberto(false)}
          onConfirmar={aoConfirmarModal}
        />
      ) : null}
    </AvisoModais>
  );
}
