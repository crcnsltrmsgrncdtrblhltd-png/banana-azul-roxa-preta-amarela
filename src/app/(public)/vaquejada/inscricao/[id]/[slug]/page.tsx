import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { InscricaoWizard } from "@/components/compra/InscricaoWizard";
import { obterVaquejada } from "@/server/eventos";
import { obterDisponibilidade } from "@/server/compra-queries";

export const metadata: Metadata = { title: "Fazer minha senha" };
export const dynamic = "force-dynamic";

interface PageParams {
  params: Promise<{ id: string; slug: string }>;
}

export default async function InscricaoPage({ params }: PageParams) {
  const { id } = await params;
  const eventoId = Number(id);

  const [evento, disponibilidade] = await Promise.all([
    obterVaquejada(eventoId),
    obterDisponibilidade(eventoId),
  ]);

  if (!evento || !disponibilidade) {
    notFound();
  }

  return (
    <Container className="py-6">
      <InscricaoWizard
        eventoId={eventoId}
        eventoNome={evento.nome}
        eventoCidade={evento.cidade}
        eventoUf={evento.uf}
        disponibilidade={disponibilidade}
      />
    </Container>
  );
}
