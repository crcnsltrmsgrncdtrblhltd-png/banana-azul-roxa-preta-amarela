import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como tratamos seus dados pessoais.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <PageShell titulo="Política de privacidade">
      <p>
        <em>
          Conteúdo provisório. O texto oficial da política de privacidade será
          fornecido pelo responsável pela plataforma.
        </em>
      </p>
      <p>
        Coletamos apenas os dados necessários para a venda antecipada de senhas
        (como nome, CPF/CNPJ, contato e data de nascimento) e os utilizamos
        exclusivamente para a prestação do serviço.
      </p>
      <p>
        O titular pode solicitar acesso, correção ou exclusão dos seus dados a
        qualquer momento, em conformidade com a LGPD.
      </p>
    </PageShell>
  );
}
