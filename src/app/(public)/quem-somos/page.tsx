import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "O Sua Senha foi criado com o principal objetivo de facilitar a vaquejada brasileira. Conheça nossa plataforma.",
};

export default function QuemSomosPage() {
  return (
    <PageShell titulo="Quem somos">
      <p>
        A Sua Senha é uma plataforma especializada na venda antecipada de
        senhas para vaquejadas de qualquer porte, conectando vaqueiros e
        organizadores de forma simples e segura.
      </p>
      <p>
        Não organizamos os eventos: atuamos exclusivamente como intermediadores
        da venda antecipada de senhas, oferecendo ferramentas para acompanhar
        compras e informações em tempo real.
      </p>
      <p>
        Nosso objetivo é tornar a participação em vaquejadas mais prática,
        transparente e acessível para todos os envolvidos.
      </p>
    </PageShell>
  );
}
