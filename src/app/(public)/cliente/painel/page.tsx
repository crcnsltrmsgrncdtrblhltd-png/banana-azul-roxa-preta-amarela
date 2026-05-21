import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { StatusBadge } from "@/components/painel/StatusBadge";
import { EditarSenhaForm } from "@/components/painel/EditarSenhaForm";
import { CancelarPedidoButton } from "@/components/painel/CancelarPedidoButton";
import { LgpdExclusaoButton } from "@/components/painel/LgpdExclusaoButton";
import { moeda, dataCurta } from "@/lib/format";

export const metadata: Metadata = { title: "Minhas Senhas" };
export const dynamic = "force-dynamic";

export default async function ClientePainelPage() {
  const session = await auth();
  const usuarioId = session?.user.id ?? "";

  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: "desc" },
    include: {
      pagamentos: { orderBy: { numeroParcela: "asc" } },
      itens: {
        include: {
          senha: { include: { evento: true, categoria: true, dia: true } },
        },
      },
    },
  });

  return (
    <Container className="py-8">
      <div className="rounded-md bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <span className="text-sm text-texto/70">
            Olá, <strong>{session?.user.name}</strong>
          </span>
          <SignOutButton />
        </div>

        <div className="px-6 py-8 text-center">
          <h1 className="font-display text-xl font-semibold uppercase tracking-wide text-escuro">
            Mantenha seus dados sempre atualizados
          </h1>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button href="/cliente/meus-dados" variant="verde">
              Meus dados
            </Button>
            <Button href="/vaquejadas" variant="amarelo">
              Fazer minha senha
            </Button>
          </div>
        </div>

        <div className="border-t border-black/10 px-6 py-6">
          <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase tracking-wide text-escuro">
            Minhas Senhas e Créditos
          </h2>

          {pedidos.length === 0 ? (
            <div className="space-y-4 py-8 text-center">
              <p className="text-texto/70">
                Você ainda não comprou nenhuma senha.
              </p>
              <Button href="/vaquejadas" variant="verde">
                Próximas vaquejadas
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => {
                const podeCancelar =
                  pedido.status === "PAGO" &&
                  pedido.itens.every(
                    (i) =>
                      i.senha.evento.vendaEncerraEm.getTime() > Date.now(),
                  );

                return (
                  <article
                    key={pedido.id}
                    className="overflow-hidden rounded border border-black/10"
                  >
                    {pedido.itens.map((item) => (
                      <div key={item.id}>
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-escuro px-4 py-3 text-white">
                          <div>
                            <p className="font-display font-semibold">
                              {item.senha.evento.nome}
                            </p>
                            <p className="text-xs text-white/70">
                              Vaqueiro:{" "}
                              {item.senha.vaqueiroNome ?? "—"}
                              {item.senha.vaqueiroCpf
                                ? ` (***${item.senha.vaqueiroCpf.slice(-4)})`
                                : ""}
                              {" "}Categoria: {item.senha.categoria.nome}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {pedido.status === "PAGO" ? (
                              <Link
                                href={`/vaquejada/inscricao/${item.senha.eventoId}/${item.senha.evento.slug}`}
                                className="rounded bg-amarelo px-3 py-1.5 font-display text-xs font-semibold uppercase text-escuro-900"
                              >
                                Editar senhas
                              </Link>
                            ) : null}
                          </div>
                        </div>

                        <div className="bg-escuro-900 px-4 py-3 text-white">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm">
                                Senha {item.senha.numero} - {item.senha.dia.label}
                              </p>
                              <p className="text-xs text-white/60">
                                {moeda(Number(item.valor))} ·{" "}
                                Inscrição: {dataCurta(pedido.criadoEm.toISOString())}
                              </p>
                            </div>
                            <div className="text-right">
                              <StatusBadge
                                status={
                                  pedido.status === "PENDENTE"
                                    ? "AGUARDANDO PAGAMENTO"
                                    : pedido.status
                                }
                              />
                              {pedido.status === "PENDENTE" ? (
                                <Link
                                  href={`/cliente/pedido/${pedido.id}`}
                                  className="mt-1 block text-xs text-amarelo hover:underline"
                                >
                                  Realizar pagamento
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {pedido.status === "PAGO" ? (
                          <div className="bg-white px-4 py-2">
                            <EditarSenhaForm
                              senhaId={item.senha.id}
                              vaqueiroNome={item.senha.vaqueiroNome ?? ""}
                              vaqueiroCpf={item.senha.vaqueiroCpf ?? ""}
                              apelido={item.senha.apelido ?? ""}
                              cidade={item.senha.cidade ?? ""}
                              uf={item.senha.uf ?? ""}
                            />
                          </div>
                        ) : null}
                      </div>
                    ))}

                    {podeCancelar ? (
                      <div className="flex justify-end bg-white px-4 py-3">
                        <CancelarPedidoButton pedidoId={pedido.id} />
                      </div>
                    ) : null}
                  </article>
                );
              })}

              <div className="flex justify-center pt-4">
                <Button href="/vaquejadas" variant="amarelo">
                  Próximas vaquejadas
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-black/10 px-6 py-4">
          <LgpdExclusaoButton />
        </div>
      </div>
    </Container>
  );
}
