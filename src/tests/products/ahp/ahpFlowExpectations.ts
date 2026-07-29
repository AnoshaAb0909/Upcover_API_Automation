import {
  resolveAhpQuickQuoteId,
} from '../../../products/ahp/data/fullQuote.payload';
import {
  mapAhpFullQuoteResponseToAnnualPaymentPayload,
  mapAhpFullQuoteResponseToMonthlyPaymentPayload,
  resolveAhpAnnualClientPayable,
  resolveAhpFirstInstallmentPayable,
  resolveAhpFullQuoteId,
  resolveAhpMonthlyClientPayable,
} from '../../../products/ahp/data/payment.mapper';
import type { AhpFullQuotePayload } from '../../../products/ahp/types/fullQuote.payload.types';
import type { AhpFullQuoteResponseBody } from '../../../products/ahp/types/fullQuote.types';
import type {
  AhpAnnualPaymentPayload,
  AhpMonthlyPaymentPayload,
} from '../../../products/ahp/types/payment.payload.types';
import type { AhpQuickQuotePayload } from '../../../products/ahp/types/quickQuote.payload.types';
import type { AhpQuickQuoteResponse } from '../../../products/ahp/types/quickQuote.types';

export type AhpFlowMode = 'annual' | 'monthly';

export function expectAhpQuickQuote(
  quickQuote: AhpQuickQuoteResponse,
  quickQuoteRequest: AhpQuickQuotePayload,
): void {
  expect(quickQuote.policyRequestId).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
  expect(quickQuote.referenceNumber).toBeTruthy();
  expect(quickQuote.totalPremium.length).toBeGreaterThan(0);
  expect(quickQuote.totalPremium[0].coverId).toBe(
    quickQuoteRequest.coverInput[0].coverId,
  );
  expect(quickQuote.totalPremium[0].premium.clientPayable).toBeGreaterThan(0);
  expect(quickQuote.coverInputs[0].id).toBe(quickQuoteRequest.coverInput[0].coverId);
  expect(quickQuote.referralDeclineReasons).toEqual([]);
}

export function expectAhpFullQuotePayload(
  payload: AhpFullQuotePayload,
  quickQuote: AhpQuickQuoteResponse,
  quickQuoteRequest: AhpQuickQuotePayload,
  mode: AhpFlowMode,
): void {
  const quoteId = resolveAhpQuickQuoteId(quickQuote);

  expect(payload.quoteId).toBe(quoteId);
  expect(payload.isMonthlySubscription).toBe(mode === 'monthly');
  expect(payload.revenueLastFy).toBe(quickQuoteRequest.averageRevenue);
  expect(payload.revenueCurrentFy).toBe(quickQuoteRequest.averageRevenue);
  expect(payload.coverInput).toEqual(quickQuoteRequest.coverInput);
  expect(payload.occupations[0].occupationId).toBe(
    quickQuoteRequest.occupations[0].id,
  );
  expect(payload.statesSplit[0].id).toBe(quickQuoteRequest.states[0].id);
  expect(payload.email).toContain('@upcover.com');
  expect(payload.firstName).toBeTruthy();
  expect(payload.lastName).toBeTruthy();
  expect(payload.insuredName).toBe(payload.companyName);
  expect(payload.companyName).toContain('PTY LTD');
}

export function expectAhpFullQuoteResponse(
  fullQuote: AhpFullQuoteResponseBody,
  quickQuote: AhpQuickQuoteResponse,
  mode: AhpFlowMode,
): void {
  const quoteId = resolveAhpQuickQuoteId(quickQuote);

  expect(fullQuote.quote.policyRequestId).toBe(quoteId);
  expect(fullQuote.quote.referenceNumber).toBeTruthy();
  expect(fullQuote.quote.totalPremium.length).toBeGreaterThan(0);
  expect(
    fullQuote.quote.totalPremium.reduce(
      (sum, item) => sum + item.premium.clientPayable,
      0,
    ),
  ).toBeGreaterThan(0);

  if (mode === 'monthly') {
    expect(
      fullQuote.monthlyPriceBreakdown?.monthlyPriceBreakdown?.monthlyInstallments
        ?.payable,
    ).toBeGreaterThan(0);
    expect(
      fullQuote.monthlyPriceBreakdown?.monthlyPriceBreakdown?.clientPayable,
    ).toBeGreaterThan(0);
    expect(fullQuote.installmentDates?.length).toBeGreaterThan(0);
  }
}

export function expectAhpPaymentPayload(
  paymentPayload: AhpAnnualPaymentPayload | AhpMonthlyPaymentPayload,
  fullQuote: AhpFullQuoteResponseBody,
  mode: AhpFlowMode,
): void {
  expect(paymentPayload.quoteId).toBe(resolveAhpFullQuoteId(fullQuote));
  expect(paymentPayload.paymentMethodId).toMatch(/^pm_/);
  expect(paymentPayload.expectedPrice).toBeGreaterThan(0);

  if (mode === 'monthly') {
    expect(paymentPayload.expectedPrice).toBe(
      resolveAhpFirstInstallmentPayable(fullQuote),
    );
    expect(paymentPayload.expectedPrice).toBeLessThan(
      resolveAhpMonthlyClientPayable(fullQuote),
    );
  } else {
    expect(paymentPayload.expectedPrice).toBe(
      resolveAhpAnnualClientPayable(fullQuote),
    );
  }
}

export function expectAhpPaymentResponse(body: unknown): void {
  expect(body).toBeDefined();
  expect(body).not.toHaveProperty('statusCode');
}
