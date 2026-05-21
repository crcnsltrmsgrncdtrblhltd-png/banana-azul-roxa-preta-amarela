import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/compra/CountdownTimer";
import { obterVaquejadaDetalhe } from "@/server/eventos";

interface PageParams {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { id } = await params;
  const evento = await obterVaquejadaDetalhe(Number(id));
  return { title: evento?.nome ?? "Vaquejada" };
}

export default async function VaquejadaDetalhePage({ params }: PageParams) {
  const { id, slug } = await params;
  const evento = await obterVaquejadaDetalhe(Number(id));

  if (!evento) {
    notFound();
  }

  const inscricaoHref = `/vaquejada/inscricao/${evento.id}/${slug}`;

  return (
    <Container className="py-8">
      <div className="overflow-hidden rounded-md bg-white shadow-sm">
        <div className="px-6 py-8 md:px-10">
          <CountdownTimer dataAlvo={evento.vendaEncerraEm} />
        </div>

        <div className="grid gap-6 px-6 pb-8 md:grid-cols-[280px_1fr] md:px-10">
          <div className="flex flex-col gap-4">
            {evento.posterUrl ? (
              <img
                src={evento.posterUrl}
                alt={evento.nome}
                className="w-full rounded shadow-md"
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded bg-escuro-900">
                <span className="font-display text-sm uppercase text-amarelo">
                  {evento.nome}
                </span>
              </div>
            )}
            <Button href={inscricaoHref} variant="amarelo" size="lg">
              Fazer minha senha
            </Button>
          </div>

          <div>
            <h2 className="mb-4 bg-escuro py-2 text-center font-display text-sm font-semibold uppercase tracking-wide text-white">
              Informações Importantes
            </h2>

            <div className="space-y-3 text-sm leading-relaxed text-texto">
              <p className="text-xs italic text-texto/60">
                OBS.: Informações podem ser alteradas sem aviso prévio.
              </p>

              {evento.categorias.map((cat) => (
                <div key={cat.id}>
                  <p className="font-semibold text-escuro">
                    {cat.nome}
                  </p>
                  <p className="ml-4 text-texto/80">{cat.regras}</p>
                </div>
              ))}

              <div className="mt-4 border-t border-black/10 pt-4">
                <p className="font-semibold uppercase text-escuro">
                  Cronograma
                </p>
                <ul className="ml-4 mt-1 space-y-1">
                  {evento.programacao.map((s) => (
                    <li key={s.dia}>
                      <span className="font-semibold">{s.dia}</span>
                      <p className="ml-4 text-texto/80">{s.descricao}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs italic text-texto/60">
                OBS.: Informações podem ser alteradas sem aviso prévio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
