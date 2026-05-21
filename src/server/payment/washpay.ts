import type {
  CobrancaInput,
  CobrancaResultado,
  PaymentProvider,
} from "@/server/payment/types";

const BASE_URL = "https://washpay.com.br/api/user";
const LIMITE_PIX = 1000;

interface WashPayResponse<TData> {
  success: boolean;
  data?: TData;
  error?: string;
}

async function washFetch<TData>(
  path: string,
  options: RequestInit = {},
): Promise<WashPayResponse<TData>> {
  const apiKey = process.env.WASHPAY_API_KEY;
  if (!apiKey) {
    throw new Error("WASHPAY_API_KEY não configurada");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  return res.json() as Promise<WashPayResponse<TData>>;
}

export async function criarPaymentLinkWashPay(
  titulo: string,
  valorReais: number,
): Promise<{ linkId: string; checkoutUrl: string }> {
  const prod = await washFetch<{ id: string }>("/products", {
    method: "POST",
    body: JSON.stringify({ name: titulo, price: valorReais }),
  });
  if (!prod.success || !prod.data) {
    throw new Error(prod.error ?? "Erro ao criar produto WashPay");
  }

  const link = await washFetch<{ id: string }>("/payment-links", {
    method: "POST",
    body: JSON.stringify({
      title: titulo,
      amount: Math.round(valorReais * 100),
      productId: prod.data.id,
      paymentMethods: ["PIX"],
    }),
  });
  if (!link.success || !link.data) {
    throw new Error(link.error ?? "Erro ao criar payment link WashPay");
  }

  return {
    linkId: link.data.id,
    checkoutUrl: `https://washpay.com.br/pay/${link.data.id}`,
  };
}

export function calcularParcelas(valor: number): number[] {
  if (valor <= LIMITE_PIX) {
    return [valor];
  }
  const parcelas: number[] = [];
  let restante = valor;
  while (restante > 0) {
    const parcela = Math.min(restante, LIMITE_PIX);
    parcelas.push(Math.round(parcela * 100) / 100);
    restante = Math.round((restante - parcela) * 100) / 100;
  }
  return parcelas;
}

export class WashPayProvider implements PaymentProvider {
  readonly nome = "washpay";

  async criarCobranca(input: CobrancaInput): Promise<CobrancaResultado> {
    const parcelas = calcularParcelas(input.valor);
    const primeira = parcelas[0];

    const { linkId, checkoutUrl } = await criarPaymentLinkWashPay(
      `${input.descricao} (1/${parcelas.length})`,
      primeira,
    );

    return {
      provider: this.nome,
      providerRef: linkId,
      aprovado: false,
      checkoutUrl,
      totalParcelas: parcelas.length,
      valorParcela: primeira,
    };
  }

  async estornar(): Promise<boolean> {
    return true;
  }
}
