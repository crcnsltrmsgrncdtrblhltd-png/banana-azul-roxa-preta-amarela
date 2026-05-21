import { randomUUID } from "node:crypto";
import type {
  CobrancaInput,
  CobrancaResultado,
  PaymentProvider,
} from "@/server/payment/types";

// Provider de desenvolvimento. Aprova tudo, exceto valor terminado em ",13"
// (gancho para testar fluxo de recusa). Substituível por SumUp futuramente.
export class MockPaymentProvider implements PaymentProvider {
  readonly nome = "mock";

  async criarCobranca(input: CobrancaInput): Promise<CobrancaResultado> {
    const recusar = Math.round(input.valor * 100) % 100 === 13;
    return {
      provider: this.nome,
      providerRef: `mock_${randomUUID()}`,
      aprovado: !recusar,
      mensagem: recusar ? "Pagamento recusado (simulado)." : undefined,
    };
  }

  async estornar(): Promise<boolean> {
    return true;
  }
}
