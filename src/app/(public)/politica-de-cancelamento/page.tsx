import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Política de cancelamento e reembolso",
  description: "Regras de cancelamento e reembolso de senhas.",
};

export default function PoliticaCancelamentoPage() {
  return (
    <PageShell titulo="Política de cancelamento e reembolso">
      <p>
        <em>
          Conteúdo provisório. O texto oficial será fornecido pelo responsável
          pela plataforma.
        </em>
      </p>
      <p>
        O cancelamento pode ser solicitado até o encerramento da venda
        antecipada do evento. O reembolso do valor da senha é processado em até
        24 horas.
      </p>
      <p>
        Taxas administrativas e juros de cartão de crédito não são
        reembolsáveis.
      </p>
    </PageShell>
  );
}
