export interface AnnualPaymentPayload {
  quoteId: string;
  paymentMethodId: string;
  expectedPrice: number;
  couponId?: string;
  isCouponApplied?: boolean;
}

export interface MonthlyPaymentPayload {
  quoteId: string;
  paymentMethodId: string;
  expectedPrice: number;
}

export type PaymentPayload = AnnualPaymentPayload;
