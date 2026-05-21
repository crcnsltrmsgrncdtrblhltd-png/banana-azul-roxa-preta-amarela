import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Como Funciona",
  description:
    "Pra fazer sua senha você primeiro precisa fazer o cadastro no site. Veja o passo a passo completo.",
};

const PASSOS = [
  {
    titulo: "1. Crie sua conta",
    texto: "Cadastre-se com seus dados para acessar a plataforma.",
  },
  {
    titulo: "2. Escolha a vaquejada",
    texto: "Navegue pelas vaquejadas e selecione o evento desejado.",
  },
  {
    titulo: "3. Selecione categoria, dia e número",
    texto:
      "Escolha a categoria, o dia e o número da senha disponível para você ou para outro vaqueiro.",
  },
  {
    titulo: "4. Pague com segurança",
    texto:
      "Finalize com cartão (parcelado), boleto ou PIX. A confirmação aparece em Minhas Senhas.",
  },
  {
    titulo: "5. Acompanhe suas senhas",
    texto:
      "Veja, edite os dados e gerencie suas senhas a qualquer momento pelo painel.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <PageShell titulo="Como funciona">
      <p>
        Comprar sua senha antecipada é rápido. Siga os passos abaixo:
      </p>
      <ol className="space-y-3">
        {PASSOS.map((p) => (
          <li key={p.titulo} className="rounded border border-black/10 p-4">
            <h2 className="font-display text-base font-semibold uppercase text-escuro">
              {p.titulo}
            </h2>
            <p className="mt-1 text-texto/80">{p.texto}</p>
          </li>
        ))}
      </ol>
      <p>
        Cancelamentos seguem a política de cancelamento e reembolso da
        plataforma.
      </p>
    </PageShell>
  );
}
