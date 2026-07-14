import {
  defaultAnnualPaymentOptions,
  defaultMonthlyPaymentOptions,
} from './payment.defaults';
import type {
  AnnualPaymentPayload,
  MonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';

function resolveClientPayable(fullQuote: FullQuoteResponse): number {
  const clientPayable = fullQuote.fullQuote.monthlyPriceBreakdown.clientPayable;

  if (clientPayable === undefined) {
    throw new Error(
      'Full quote response is missing monthlyPriceBreakdown.clientPayable',
    );
  }

  return clientPayable;
}

function resolveFirstInstallmentPayable(fullQuote: FullQuoteResponse): number {
  const firstInstallmentPayable =
    fullQuote.fullQuote.monthlyPriceBreakdown.monthlyBreakdown?.firstInstallmentPayable;

  if (firstInstallmentPayable === undefined) {
    throw new Error(
      'Full quote response is missing monthlyPriceBreakdown.monthlyBreakdown.firstInstallmentPayable',
    );
  }

  return firstInstallmentPayable;
}

export function resolveFullQuoteId(fullQuote: FullQuoteResponse): string {
  return fullQuote.fullQuote.id;
}

export function mapFullQuoteResponseToAnnualPaymentPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<AnnualPaymentPayload> = {},
): AnnualPaymentPayload {
  const quoteId = resolveFullQuoteId(fullQuote);

  return {
    quoteId,
    paymentMethodId: defaultAnnualPaymentOptions.paymentMethodId,
    expectedPrice: resolveClientPayable(fullQuote),
    ...overrides,
  };
}

export function mapFullQuoteResponseToMonthlyPaymentPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<MonthlyPaymentPayload> = {},
): MonthlyPaymentPayload {
  const quoteId = resolveFullQuoteId(fullQuote);

  return {
    quoteId,
    paymentMethodId: defaultMonthlyPaymentOptions.paymentMethodId,
    expectedPrice: resolveFirstInstallmentPayable(fullQuote),
    ...overrides,
  };
}

/** @deprecated Use mapFullQuoteResponseToAnnualPaymentPayload */
export const mapFullQuoteResponseToPaymentPayload =
  mapFullQuoteResponseToAnnualPaymentPayload;
