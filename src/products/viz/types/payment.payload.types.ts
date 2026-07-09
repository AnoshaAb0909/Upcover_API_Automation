export interface VizAnnualPaymentPayload {
  quoteId: string;
  paymentMethodId: string;
  expectedPrice: number;
}

export interface VizMonthlyPaymentPayload {
  quoteId: string;
  paymentMethodId: string;
  expectedPrice: number;
}
