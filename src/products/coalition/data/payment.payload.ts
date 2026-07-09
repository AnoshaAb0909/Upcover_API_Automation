import {
  mapFullQuoteResponseToAnnualPaymentPayload,
  mapFullQuoteResponseToMonthlyPaymentPayload,
} from './payment.mapper';
import type {
  AnnualPaymentPayload,
  MonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';

export {
  mapFullQuoteResponseToAnnualPaymentPayload,
  mapFullQuoteResponseToMonthlyPaymentPayload,
  mapFullQuoteResponseToPaymentPayload,
  resolveFullQuoteId,
} from './payment.mapper';

export function buildAnnualPaymentPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<AnnualPaymentPayload> = {},
): AnnualPaymentPayload {
  return mapFullQuoteResponseToAnnualPaymentPayload(fullQuote, overrides);
}

export function buildMonthlyPaymentPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<MonthlyPaymentPayload> = {},
): MonthlyPaymentPayload {
  return mapFullQuoteResponseToMonthlyPaymentPayload(fullQuote, overrides);
}

/** @deprecated Use buildAnnualPaymentPayload */
export function buildPaymentPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<AnnualPaymentPayload> = {},
): AnnualPaymentPayload {
  return buildAnnualPaymentPayload(fullQuote, overrides);
}
