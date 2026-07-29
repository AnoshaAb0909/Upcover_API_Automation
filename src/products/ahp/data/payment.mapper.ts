import {
  defaultAhpAnnualPaymentOptions,
  defaultAhpMonthlyPaymentOptions,
} from './payment.defaults';
import type {
  AhpAnnualPaymentPayload,
  AhpMonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { AhpFullQuoteResponseBody } from '../types/fullQuote.types';

export function resolveAhpFullQuoteId(fullQuote: AhpFullQuoteResponseBody): string {
  return fullQuote.quote.policyRequestId;
}

export function resolveAhpAnnualClientPayable(
  fullQuote: AhpFullQuoteResponseBody,
): number {
  const totalPremium = fullQuote.quote.totalPremium;

  if (!totalPremium?.length) {
    throw new Error('Full quote response is missing quote.totalPremium');
  }

  return totalPremium.reduce(
    (sum, item) => sum + (item.premium.clientPayable ?? 0),
    0,
  );
}

export function resolveAhpMonthlyClientPayable(
  fullQuote: AhpFullQuoteResponseBody,
): number {
  const clientPayable =
    fullQuote.monthlyPriceBreakdown?.monthlyPriceBreakdown?.clientPayable;

  if (clientPayable === undefined) {
    throw new Error(
      'Full quote response is missing monthlyPriceBreakdown.monthlyPriceBreakdown.clientPayable',
    );
  }

  return clientPayable;
}

export function resolveAhpFirstInstallmentPayable(
  fullQuote: AhpFullQuoteResponseBody,
): number {
  const firstInstallmentPayable =
    fullQuote.monthlyPriceBreakdown?.monthlyPriceBreakdown?.monthlyInstallments
      ?.payable;

  if (firstInstallmentPayable === undefined) {
    throw new Error(
      'Full quote response is missing monthlyPriceBreakdown.monthlyPriceBreakdown.monthlyInstallments.payable',
    );
  }

  return firstInstallmentPayable;
}

export function mapAhpFullQuoteResponseToAnnualPaymentPayload(
  fullQuote: AhpFullQuoteResponseBody,
  overrides: Partial<AhpAnnualPaymentPayload> = {},
): AhpAnnualPaymentPayload {
  return {
    quoteId: resolveAhpFullQuoteId(fullQuote),
    paymentMethodId: defaultAhpAnnualPaymentOptions.paymentMethodId,
    expectedPrice: resolveAhpAnnualClientPayable(fullQuote),
    ...overrides,
  };
}

export function mapAhpFullQuoteResponseToMonthlyPaymentPayload(
  fullQuote: AhpFullQuoteResponseBody,
  overrides: Partial<AhpMonthlyPaymentPayload> = {},
): AhpMonthlyPaymentPayload {
  return {
    quoteId: resolveAhpFullQuoteId(fullQuote),
    paymentMethodId: defaultAhpMonthlyPaymentOptions.paymentMethodId,
    expectedPrice: resolveAhpFirstInstallmentPayable(fullQuote),
    ...overrides,
  };
}
