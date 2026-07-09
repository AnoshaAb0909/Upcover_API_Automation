import type { VizFullQuotePayload } from './fullQuote.payload.types';

export type { VizFullQuotePayload } from './fullQuote.payload.types';

export interface VizMonthlyBreakdown {
  firstInstallmentPayable: number;
  monthlyPayable?: number;
  upcoverFee?: number;
  stripeFee?: number;
  monthlyPremium?: number;
  monthlyPremiumFee?: number;
  monthliesFee?: number;
  monthliesFeeGst?: number;
  totalPayable?: number;
  [key: string]: unknown;
}

export interface VizFullQuotePriceBreakdown {
  basePremium?: number;
  gst?: number;
  emergencyServicesLevy?: number;
  stampDuty?: number;
  serviceFee?: number;
  brokerFee?: number;
  clientPayable: number;
  paymentGatewayFee?: number;
  monthlyBreakdown?: VizMonthlyBreakdown;
  [key: string]: unknown;
}

export interface VizFullQuoteDetails {
  id: string;
  type: string;
  isMonthlySubscription: boolean;
  priceBreakdown: VizFullQuotePriceBreakdown;
  req: VizFullQuotePayload;
  [key: string]: unknown;
}

export interface VizFullQuoteResponse {
  fullQuote: VizFullQuoteDetails;
  [key: string]: unknown;
}
