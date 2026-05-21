import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/server/db";
import { criarPaymentLinkWashPay, calcularParcelas } from "@/server/payment/washpay";

interface WashPayWebhook {
  orderId: string;
  orderNumber: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED" | "CHARGEBACK";
  createdAt: string;
  updatedAt: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as WashPayWebhook | null;
  if (!body?.status) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  console.log("[webhook]", body.status, body.orderId);

  const pagamento = await prisma.pagamento.findFirst({
    where: { providerRef: body.orderId },
    include: {
      pedido: { include: { itens: { include: { senha: true } } } },
    },
  });

  if (!pagamento) {
    return NextResponse.json({ received: true, matched: false });
  }

  const pedidoId = pagamento.pedido.id;
  const senhaIds = pagamento.pedido.itens.map((i) => i.senha.id);

  if (body.status === "PAID") {
    await prisma.pagamento.update({
      where: { id: pagamento.id },
      data: { status: "APROVADO" },
    });

    if (pagamento.numeroParcela < pagamento.totalParcelas) {
      const totalEvento = Number(pagamento.pedido.total);
      const parcelas = calcularParcelas(totalEvento);
      const proxIdx = pagamento.numeroParcela;
      const proxValor = parcelas[proxIdx] ?? parcelas[parcelas.length - 1];

      try {
        const { linkId, checkoutUrl } = await criarPaymentLinkWashPay(
          `Parcela ${proxIdx + 1}/${pagamento.totalParcelas}`,
          proxValor,
        );

        await prisma.pagamento.create({
          data: {
            pedidoId,
            provider: "washpay",
            providerRef: linkId,
            checkoutUrl,
            metodo: pagamento.metodo,
            numeroParcela: proxIdx + 1,
            totalParcelas: pagamento.totalParcelas,
            valor: proxValor,
            status: "PENDENTE",
          },
        });
      } catch (err) {
        console.error("[webhook] erro ao gerar próxima parcela:", err);
      }

      return NextResponse.json({
        received: true,
        status: "PARTIAL",
        parcela: pagamento.numeroParcela,
      });
    }

    await prisma.$transaction([
      prisma.pedido.update({
        where: { id: pedidoId },
        data: { status: "PAGO" },
      }),
      ...senhaIds.map((id) =>
        prisma.senha.update({
          where: { id },
          data: { status: "VENDIDA", reservadaAte: null },
        }),
      ),
    ]);

    return NextResponse.json({ received: true, status: "PAID" });
  }

  if (body.status === "CANCELLED") {
    await prisma.$transaction([
      prisma.pagamento.update({
        where: { id: pagamento.id },
        data: { status: "RECUSADO" },
      }),
      prisma.pedido.update({
        where: { id: pedidoId },
        data: { status: "CANCELADO" },
      }),
      ...senhaIds.map((id) =>
        prisma.senha.update({
          where: { id },
          data: { status: "DISPONIVEL", reservadaAte: null, compradorId: null },
        }),
      ),
    ]);
  }

  if (body.status === "REFUNDED") {
    await prisma.$transaction([
      prisma.pagamento.update({
        where: { id: pagamento.id },
        data: { status: "ESTORNADO" },
      }),
      prisma.pedido.update({
        where: { id: pedidoId },
        data: { status: "REEMBOLSADO" },
      }),
      ...senhaIds.map((id) =>
        prisma.senha.update({
          where: { id },
          data: { status: "DISPONIVEL", reservadaAte: null, compradorId: null },
        }),
      ),
    ]);
  }

  return NextResponse.json({ received: true, status: body.status });
}

export async function GET() {
  return NextResponse.json({ status: "webhook ativo" });
}
