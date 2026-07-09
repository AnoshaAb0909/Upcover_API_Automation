import {
  defaultVizAnnualPaymentOptions,
  defaultVizMonthlyPaymentOptions,
} from './payment.defaults';
import type {
  VizAnnualPaymentPayload,
  VizMonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';

export function resolveVizFullQuoteId(fullQuote: VizFullQuoteResponse): string {
  return fullQuote.fullQuote.id;
}

export function resolveVizClientPayable(fullQuote: VizFullQuoteResponse): number {
  const clientPayable = fullQuote.fullQuote.priceBreakdown.clientPayable;

  if (clientPayable === undefined) {
    throw new Error('Full quote response is missing priceBreakdown.clientPayable');
  }

  return clientPayable;
}

export function resolveVizFirstInstallmentPayable(
  fullQuote: VizFullQuoteResponse,
): number {
  const firstInstallmentPayable =
    fullQuote.fullQuote.priceBreakdown.monthlyBreakdown?.firstInstallmentPayable;

  if (firstInstallmentPayable === undefined) {
    throw new Error(
      'Full quote response is missing priceBreakdown.monthlyBreakdown.firstInstallmentPayable',
    );
  }

  return firstInstallmentPayable;
}

export function mapVizFullQuoteResponseToAnnualPaymentPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizAnnualPaymentPayload> = {},
): VizAnnualPaymentPayload {
  return {
    quoteId: resolveVizFullQuoteId(fullQuote),
    paymentMethodId: defaultVizAnnualPaymentOptions.paymentMethodId,
    expectedPrice: resolveVizClientPayable(fullQuote),
    ...overrides,
  };
}

export function mapVizFullQuoteResponseToMonthlyPaymentPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizMonthlyPaymentPayload> = {},
): VizMonthlyPaymentPayload {
  return {
    quoteId: resolveVizFullQuoteId(fullQuote),
    paymentMethodId: defaultVizMonthlyPaymentOptions.paymentMethodId,
    expectedPrice: resolveVizFirstInstallmentPayable(fullQuote),
    ...overrides,
  };
}
