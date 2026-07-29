export interface AhpAnnualPaymentPayload {
  quoteId: string;
  paymentMethodId: string;
  expectedPrice: number;
}

export interface AhpMonthlyPaymentPayload {
  quoteId: string;
  paymentMethodId: string;
  expectedPrice: number;
}
