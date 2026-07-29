import { resolveSharedPaymentMethodId } from '../../../core/payments';
import {
  mapAhpFullQuoteResponseToAnnualPaymentPayload,
  mapAhpFullQuoteResponseToMonthlyPaymentPayload,
  resolveAhpAnnualClientPayable,
  resolveAhpFullQuoteId,
  resolveAhpMonthlyClientPayable,
} from './payment.mapper';
import type {
  AhpAnnualPaymentPayload,
  AhpMonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { AhpFullQuoteResponseBody } from '../types/fullQuote.types';

export {
  mapAhpFullQuoteResponseToAnnualPaymentPayload,
  mapAhpFullQuoteResponseToMonthlyPaymentPayload,
  resolveAhpAnnualClientPayable,
  resolveAhpFullQuoteId,
  resolveAhpFirstInstallmentPayable,
  resolveAhpMonthlyClientPayable,
} from './payment.mapper';

export function buildAhpAnnualPaymentPayload(
  fullQuote: AhpFullQuoteResponseBody,
  overrides: Partial<AhpAnnualPaymentPayload> = {},
): AhpAnnualPaymentPayload {
  return mapAhpFullQuoteResponseToAnnualPaymentPayload(fullQuote, overrides);
}

export async function buildAhpAnnualPaymentPayloadFromFullQuote(
  fullQuote: AhpFullQuoteResponseBody,
  clientEmail: string,
  overrides: Partial<AhpAnnualPaymentPayload> = {},
): Promise<AhpAnnualPaymentPayload> {
  const paymentMethodId = await resolveSharedPaymentMethodId(clientEmail, 'annual');

  return buildAhpAnnualPaymentPayload(fullQuote, { paymentMethodId, ...overrides });
}

export function buildAhpMonthlyPaymentPayload(
  fullQuote: AhpFullQuoteResponseBody,
  overrides: Partial<AhpMonthlyPaymentPayload> = {},
): AhpMonthlyPaymentPayload {
  return mapAhpFullQuoteResponseToMonthlyPaymentPayload(fullQuote, overrides);
}

export async function buildAhpMonthlyPaymentPayloadFromFullQuote(
  fullQuote: AhpFullQuoteResponseBody,
  clientEmail: string,
  overrides: Partial<AhpMonthlyPaymentPayload> = {},
): Promise<AhpMonthlyPaymentPayload> {
  const paymentMethodId = await resolveSharedPaymentMethodId(clientEmail, 'monthly');

  return buildAhpMonthlyPaymentPayload(fullQuote, { paymentMethodId, ...overrides });
}
