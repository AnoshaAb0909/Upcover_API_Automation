import {
  mapVizFullQuoteResponseToAnnualPaymentPayload,
  mapVizFullQuoteResponseToMonthlyPaymentPayload,
} from './payment.mapper';
import type {
  VizAnnualPaymentPayload,
  VizMonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';

export {
  mapVizFullQuoteResponseToAnnualPaymentPayload,
  mapVizFullQuoteResponseToMonthlyPaymentPayload,
  resolveVizClientPayable,
  resolveVizFirstInstallmentPayable,
  resolveVizFullQuoteId,
} from './payment.mapper';

export function buildVizAnnualPaymentPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizAnnualPaymentPayload> = {},
): VizAnnualPaymentPayload {
  return mapVizFullQuoteResponseToAnnualPaymentPayload(fullQuote, overrides);
}

export function buildVizMonthlyPaymentPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizMonthlyPaymentPayload> = {},
): VizMonthlyPaymentPayload {
  return mapVizFullQuoteResponseToMonthlyPaymentPayload(fullQuote, overrides);
}
