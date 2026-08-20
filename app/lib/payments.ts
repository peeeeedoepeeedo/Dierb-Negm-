export type PaymentRequest = {
  reference: string;
  amountMinor: number;
  currency: "EGP";
  returnUrl: string;
  customerEmail?: string;
};

export type PaymentSession = {
  providerReference: string;
  checkoutUrl: string;
};

export type VerifiedPaymentEvent = {
  providerReference: string;
  reference: string;
  status: "paid" | "failed" | "refunded";
  amountMinor: number;
  currency: string;
};

export interface PaymentProvider {
  createCheckout(request: PaymentRequest): Promise<PaymentSession>;
  verifyWebhook(payload: ArrayBuffer, signature: string): Promise<VerifiedPaymentEvent>;
}

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER;
  if (!provider) {
    throw new Error("PAYMENT_PROVIDER is not configured; fake payments are disabled");
  }
  throw new Error(`Payment provider '${provider}' is not installed`);
}
