export type MetodoPagamento = "CARTAO" | "BOLETO" | "PIX";

export interface CobrancaInput {
  pedidoId: string;
  valor: number;
  metodo: MetodoPagamento;
  parcelas: number;
  descricao: string;
}

export interface CobrancaResultado {
  provider: string;
  providerRef: string;
  aprovado: boolean;
  mensagem?: string;
  checkoutUrl?: string;
  totalParcelas?: number;
  valorParcela?: number;
}

export interface PaymentProvider {
  readonly nome: string;
  criarCobranca(input: CobrancaInput): Promise<CobrancaResultado>;
  estornar(providerRef: string): Promise<boolean>;
}
