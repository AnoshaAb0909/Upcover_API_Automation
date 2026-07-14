import type { FullQuotePayload } from './fullQuote.payload.types';
import type { MonthlyBreakdown } from './quickQuote.types';

export type { FullQuotePayload };

export interface FullQuoteMonthlyPriceBreakdown {
  basePremium?: number;
  gst?: number;
  emergencyServicesLevy?: number;
  stampDuty?: number;
  serviceFee?: number;
  brokerFee?: number;
  clientPayable: number;
  paymentGatewayFee?: number;
  monthlyBreakdown?: MonthlyBreakdown;
  [key: string]: unknown;
}

export interface FullQuoteDetails {
  id: string;
  type: string;
  isMonthlySubscription: boolean;
  monthlyPriceBreakdown: FullQuoteMonthlyPriceBreakdown;
  req: FullQuotePayload;
  [key: string]: unknown;
}

export interface FullQuoteResponse {
  fullQuote: FullQuoteDetails;
  changes: unknown;
  installmentSchedule: unknown;
  couponCheck: unknown;
}
