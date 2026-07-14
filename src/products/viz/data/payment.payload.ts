import { resolveSharedPaymentMethodId } from '../../../core/payments';
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

export async function buildVizAnnualPaymentPayloadFromFullQuote(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizAnnualPaymentPayload> = {},
): Promise<VizAnnualPaymentPayload> {
  const email = fullQuote.fullQuote.req.clientInformation.email;
  const paymentMethodId = await resolveSharedPaymentMethodId(email, 'annual');

  return buildVizAnnualPaymentPayload(fullQuote, { paymentMethodId, ...overrides });
}

export async function buildVizMonthlyPaymentPayloadFromFullQuote(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizMonthlyPaymentPayload> = {},
): Promise<VizMonthlyPaymentPayload> {
  const email = fullQuote.fullQuote.req.clientInformation.email;
  const paymentMethodId = await resolveSharedPaymentMethodId(email, 'monthly');

  return buildVizMonthlyPaymentPayload(fullQuote, { paymentMethodId, ...overrides });
}
