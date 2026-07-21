import type { VizFullQuotePayload } from './fullQuote.payload.types';
import type { VizFullQuoteDetails } from './fullQuote.types';
import type { VizOccupationInput } from './quickQuote.payload.types';

export interface VizEndorsementMetadata {
  flow: string;
  quoteId: string;
}

export type VizEndorsementOccupation =
  | VizOccupationInput
  | { occupationId: string; secondDeclaration?: boolean };

export interface VizEndorsementPayload
  extends Omit<VizFullQuotePayload, 'quoteId' | 'metadata' | 'occupations'> {
  parentQuoteId: string;
  endorsementEffectiveDate: string;
  isCouponApplied: boolean;
  occupations: VizEndorsementOccupation[];
  metadata: VizEndorsementMetadata;
}

export interface VizEndorsementResponse {
  fullQuote?: VizFullQuoteDetails;
  [key: string]: unknown;
}

export interface VizEndorsementMonthlyPaymentPayload {
  quoteId: string;
  paymentMethodId: string;
  expectedPrice: number;
}

export type VizEndorsementAnnualPaymentPayload = VizEndorsementMonthlyPaymentPayload;
