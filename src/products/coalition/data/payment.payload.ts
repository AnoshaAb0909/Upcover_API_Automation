import { resolveSharedPaymentMethodId } from '../../../core/payments';
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

export async function buildAnnualPaymentPayloadFromFullQuote(
  fullQuote: FullQuoteResponse,
  overrides: Partial<AnnualPaymentPayload> = {},
): Promise<AnnualPaymentPayload> {
  const email = fullQuote.fullQuote.req.clientInformation.email;
  const paymentMethodId = await resolveSharedPaymentMethodId(email, 'annual');

  return buildAnnualPaymentPayload(fullQuote, { paymentMethodId, ...overrides });
}

export async function buildMonthlyPaymentPayloadFromFullQuote(
  fullQuote: FullQuoteResponse,
  overrides: Partial<MonthlyPaymentPayload> = {},
): Promise<MonthlyPaymentPayload> {
  const email = fullQuote.fullQuote.req.clientInformation.email;
  const paymentMethodId = await resolveSharedPaymentMethodId(email, 'monthly');

  return buildMonthlyPaymentPayload(fullQuote, { paymentMethodId, ...overrides });
}

/** @deprecated Use buildAnnualPaymentPayload */
export function buildPaymentPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<AnnualPaymentPayload> = {},
): AnnualPaymentPayload {
  return buildAnnualPaymentPayload(fullQuote, overrides);
}
