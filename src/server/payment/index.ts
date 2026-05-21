import type { PaymentProvider } from "@/server/payment/types";
import { MockPaymentProvider } from "@/server/payment/mock";
import { WashPayProvider } from "@/server/payment/washpay";

let instancia: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!instancia) {
    instancia = process.env.WASHPAY_API_KEY
      ? new WashPayProvider()
      : new MockPaymentProvider();
  }
  return instancia;
}

export type { PaymentProvider } from "@/server/payment/types";
