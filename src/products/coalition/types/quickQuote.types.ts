import type { QuickQuotePayload } from './quickQuote.payload.types';
import type { QuickQuoteCoalitionResponse } from './quickQuote.response.types';

export type { QuickQuotePayload };
export type {
  QuickQuoteApplicationResponses,
  QuickQuoteCoalitionResponse,
} from './quickQuote.response.types';

export interface MonthlyBreakdown {
  firstInstallmentPayable: number;
  monthlyPayable: number;
  upcoverFee: number;
  stripeFee: number;
  monthlyPremium: number;
  monthlyPremiumFee: number;
  monthliesFee: number;
  monthliesFeeGst: number;
  totalPayable: number;
}

export interface MonthlyPriceBreakdown {
  basePremium: number;
  gst: number;
  emergencyServicesLevy: number;
  stampDuty: number;
  serviceFee: number;
  brokerFee: number;
  clientPayable: number;
  paymentGatewayFee: number;
  monthlyBreakdown: MonthlyBreakdown;
}

export interface QuickQuoteResponse {
  id: string;
  type: string;
  partnerId: string;
  monthlyPriceBreakdown: MonthlyPriceBreakdown;
  req: QuickQuotePayload & { partnerId?: string };
  res: QuickQuoteCoalitionResponse;
  isMonthlySubscription: boolean;
  phantomQuoteId: string;
  phantomQuotes: unknown[];
  coalitionPackageId: string;
  createdAt: string;
}
