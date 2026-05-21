"use client";

import { useState } from "react";
import { AlertCircle, Info } from "lucide-react";

interface AvisoModaisProps {
  children: React.ReactNode;
}

export function AvisoModais({ children }: AvisoModaisProps) {
  const [etapa, setEtapa] = useState<0 | 1 | 2>(0);

  if (etapa === 0) {
    return (
      <Modal
        icone={<AlertCircle size={48} className="text-amarelo" />}
        titulo="Atenção!"
        botao="OK"
        onConfirmar={() => setEtapa(1)}
      >
        <p>
          A organização do parque avisa que julgará as inscrições dos vaqueiros
          nas categorias de acordo com os critérios da vaquejada.
        </p>
        <p>
          É de sua inteira responsabilidade, caso esteja inscrito o vaqueiro na
          categoria que ele não corresponde.{" "}
          <strong>
            Podendo comprometer sua inscrição e em caso de cancelamento o valor
            pago não será devolvido.
          </strong>
        </p>
      </Modal>
    );
  }

  if (etapa === 1) {
    return (
      <Modal
        icone={<Info size={48} className="text-azul" />}
        titulo="Informativo!"
        botao="OK, ENTENDI"
        onConfirmar={() => setEtapa(2)}
      >
        <p>
          Prezando pela igualdade e disponibilidade de senhas para todos, a Sua
          Senha vem comunicar que o site não fará reserva de senhas. O vaqueiro
          só terá a senha garantida mediante pagamento.
        </p>
        <p>
          Caso a senha seja apenas iniciada e não seja gerado o pagamento, a
          mesma será cancelada imediatamente e disponibilizada para venda
          novamente.
        </p>
        <p>
          Esperamos que assim, todos tenham a oportunidade de comprar sua senha
          com numeração justa.
        </p>
        <p>Agradecemos a compreensão de todos.</p>
      </Modal>
    );
  }

  return <>{children}</>;
}

function Modal({
  icone,
  titulo,
  botao,
  onConfirmar,
  children,
}: {
  icone: React.ReactNode;
  titulo: string;
  botao: string;
  onConfirmar: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          {icone}
          <h2 className="font-display text-xl font-semibold text-escuro">
            {titulo}
          </h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-texto">
          {children}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onConfirmar}
            className="rounded bg-escuro px-6 py-2.5 font-display text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-escuro-900"
          >
            {botao}
          </button>
        </div>
      </div>
    </div>
  );
}
