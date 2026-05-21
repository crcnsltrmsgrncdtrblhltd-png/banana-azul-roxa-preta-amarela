import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/painel/StatusBadge";
import { RefreshButton } from "@/components/compra/RefreshButton";
import { moeda } from "@/lib/format";

export const metadata: Metadata = { title: "Resumo das Senhas" };
export const dynamic = "force-dynamic";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function PedidoStatusPage({ params }: PageParams) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/cliente/login?redirect=/cliente/pedido/${id}`);
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      pagamentos: { orderBy: { numeroParcela: "asc" } },
      itens: {
        include: {
          senha: { include: { evento: true, categoria: true, dia: true } },
        },
      },
    },
  });

  if (!pedido || pedido.usuarioId !== session.user.id) {
    notFound();
  }

  const todasPagas = pedido.pagamentos.every((p) => p.status === "APROVADO");
  const totalParcelas = pedido.pagamentos[0]?.totalParcelas ?? 1;

  if (pedido.status === "PAGO" || todasPagas) {
    return (
      <Container className="py-8">
        <div className="mx-auto max-w-3xl space-y-4 rounded-md bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-2xl font-semibold uppercase text-verde">
            Senha confirmada!
          </h1>
          {pedido.itens[0] ? (
            <p className="text-sm text-texto/70">
              {pedido.itens[0].senha.evento.nome} —{" "}
              {pedido.itens[0].senha.categoria.nome} — Senha nº{" "}
              {pedido.itens[0].senha.numero}
            </p>
          ) : null}
          <Button href="/cliente/painel" variant="verde">
            Ver Minhas Senhas
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mx-auto max-w-3xl rounded-md bg-white shadow-sm">
        <div className="px-6 py-6 text-center md:px-10">
          <h1 className="font-display text-xl font-semibold uppercase tracking-wide text-escuro">
            Resumo das Senhas
          </h1>
        </div>

        <div className="bg-amarelo py-2 text-center text-xs font-semibold uppercase text-escuro-900">
          Senha não finalizada! Para finalizar a senha, gere o pagamento
        </div>

        {pedido.itens[0] ? (
          <div className="bg-verde py-1.5 text-center text-xs font-semibold uppercase text-white">
            Senhas para {pedido.itens[0].senha.evento.nome}
          </div>
        ) : null}

        <div className="overflow-x-auto px-6 py-4 md:px-10">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 text-left">
              <tr>
                <th className="pb-2 pr-3"></th>
                <th className="pb-2 pr-3">Descrição</th>
                <th className="pb-2 pr-3">Senha</th>
                <th className="pb-2 pr-3">Vaqueiro</th>
                <th className="pb-2 pr-3">Categoria</th>
                <th className="pb-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {pedido.itens.map((item) => (
                <tr key={item.id} className="border-b border-black/10">
                  <td className="py-3 pr-3">
                    <StatusBadge
                      status={
                        pedido.status === "PENDENTE"
                          ? "AGUARDANDO"
                          : pedido.status
                      }
                    />
                  </td>
                  <td className="py-3 pr-3">
                    Senha{item.senha.boiNaTv ? " + Boi na TV" : ""}
                  </td>
                  <td className="py-3 pr-3">
                    {item.senha.numero} - {item.senha.dia.label}
                  </td>
                  <td className="py-3 pr-3">
                    {item.senha.apelido || item.senha.vaqueiroNome || "—"}
                  </td>
                  <td className="py-3 pr-3">{item.senha.categoria.nome}</td>
                  <td className="py-3 text-right font-semibold">
                    {moeda(Number(item.valor))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="pt-3 text-right font-semibold">
                  Total
                </td>
                <td className="pt-3 text-right font-display text-lg font-bold text-escuro">
                  {moeda(Number(pedido.total))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="border-t border-black/10 px-6 py-4 md:px-10">
          <Link
            href="/vaquejadas"
            className="inline-block rounded bg-verde px-5 py-2.5 font-display text-xs font-semibold uppercase text-white hover:bg-verde-escuro"
          >
            Adicionar mais senhas ao pagamento
          </Link>
        </div>

        <div className="border-t border-black/10 px-6 py-4 text-xs leading-relaxed text-texto/70 md:px-10">
          <ul className="list-inside list-disc space-y-1">
            <li>
              NÃO RESERVAMOS SENHAS! AS SENHAS QUE NÃO TIVER COBRANÇA GERADA
              SÃO LIBERADAS NO MAPA A QUALQUER MOMENTO.
            </li>
            <li>
              Você pode realizar o pagamento através de PIX{" "}
              {moeda(Number(pedido.total))} + TAXA ADMINISTRATIVA de R$ 3,60.
            </li>
            <li>
              FIQUE ATENTO: EM CASO DE DEVOLUÇÃO, É DEVOLVIDO O VALOR DA
              SENHA. OS ACRÉSCIMOS SÃO COBRADOS PELO BANCO E O SITE NÃO
              CONSEGUE DEVOLVER.
            </li>
          </ul>
        </div>

        <div className="space-y-3 px-6 pb-8 md:px-10">
          {pedido.pagamentos.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded border border-black/10 p-4"
            >
              <div>
                <p className="font-display text-sm font-semibold text-escuro">
                  Pagamento {p.numeroParcela} de {totalParcelas}
                </p>
                <p className="text-xs text-texto/70">
                  {moeda(Number(p.valor))}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  status={p.status === "APROVADO" ? "PAGO" : p.status}
                />
                {p.status === "PENDENTE" && p.checkoutUrl ? (
                  <a
                    href={p.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-verde px-5 py-2.5 font-display text-xs font-semibold uppercase text-white hover:bg-verde-escuro"
                  >
                    Pagar com PIX
                  </a>
                ) : null}
              </div>
            </div>
          ))}

          {pedido.pagamentos.some((p) => p.status === "PENDENTE") ? (
            <div className="text-center">
              <RefreshButton />
              <p className="mt-2 text-xs text-texto/50">
                A página atualiza automaticamente ao confirmar o PIX.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
