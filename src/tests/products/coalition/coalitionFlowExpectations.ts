import { COALITION_FULL_QUOTE_DOMAIN_NAMES } from '../../../products/coalition/data/fullQuote.defaults';
import { resolveQuickQuoteId } from '../../../products/coalition/data/fullQuote.payload';
import type { FullQuotePayload } from '../../../products/coalition/types/fullQuote.payload.types';
import type { FullQuoteResponse } from '../../../products/coalition/types/fullQuote.types';
import type {
  AnnualPaymentPayload,
  MonthlyPaymentPayload,
} from '../../../products/coalition/types/payment.payload.types';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';

export type CoalitionFlowMode = 'annual' | 'monthly';

export function expectCoalitionQuickQuote(quickQuote: QuickQuoteResponse): void {
  expect(quickQuote.id).toMatch(/^col_/);
  expect(quickQuote.req.companyName).toBeTruthy();
  expect(quickQuote.req.companyRevenue).toBeGreaterThan(0);
  expect(quickQuote.req.aggregateLimit).toBeGreaterThan(0);
  expect(quickQuote.req.clientInformation.email).toMatch(/@/);
  expect(quickQuote.res.aggregateLimit).toBe(quickQuote.req.aggregateLimit);
  expect(quickQuote.res.companyName).toBe(quickQuote.req.companyName);
  expect(quickQuote.res.companyRevenue).toBe(quickQuote.req.companyRevenue);
}

export function expectCoalitionFullQuotePayload(
  payload: FullQuotePayload,
  quickQuote: QuickQuoteResponse,
  mode: CoalitionFlowMode,
): void {
  const quoteId = resolveQuickQuoteId(quickQuote);

  expect(payload.quoteId).toBe(quoteId);
  expect(payload.metadata.quoteId).toBe(quoteId);
  expect(payload.isMonthlySubscription).toBe(mode === 'monthly');
  expect(payload.declarations.hasDomains).toBe('Yes');
  expect(payload.domainNames).toEqual(COALITION_FULL_QUOTE_DOMAIN_NAMES);
  expect(payload.companyName).toBe(quickQuote.req.companyName);
  expect(payload.companyRevenue).toBe(quickQuote.req.companyRevenue);
  expect(payload.aggregateLimit).toBe(quickQuote.req.aggregateLimit);
  expect(payload.clientInformation.email).toBe(
    quickQuote.req.clientInformation.email,
  );
  expect(payload.policyStartDate).toBeTruthy();
  expect(payload.policyExpiryDate).toBeTruthy();
}

export function expectCoalitionFullQuoteResponse(
  fullQuote: FullQuoteResponse,
  quickQuote: QuickQuoteResponse,
  mode: CoalitionFlowMode,
): void {
  const quoteId = resolveQuickQuoteId(quickQuote);
  const { monthlyPriceBreakdown, req } = fullQuote.fullQuote;

  expect(fullQuote.fullQuote.id).toMatch(/^col_/);
  expect(fullQuote.fullQuote.id).not.toBe(quoteId);
  expect(req.quoteId).toBe(quoteId);
  expect(fullQuote.fullQuote.isMonthlySubscription).toBe(mode === 'monthly');
  expect(req.declarations.hasDomains).toBe('Yes');
  expect(req.domainNames).toEqual(COALITION_FULL_QUOTE_DOMAIN_NAMES);
  expect(req.companyName).toBe(quickQuote.req.companyName);
  expect(req.companyRevenue).toBe(quickQuote.req.companyRevenue);
  expect(monthlyPriceBreakdown.clientPayable).toBeGreaterThan(0);

  if (mode === 'monthly') {
    expect(monthlyPriceBreakdown.monthlyBreakdown?.firstInstallmentPayable).toBeGreaterThan(
      0,
    );
    expect(monthlyPriceBreakdown.monthlyBreakdown?.monthlyPayable).toBeGreaterThan(0);
  }
}

export function expectCoalitionPaymentPayload(
  paymentPayload: AnnualPaymentPayload | MonthlyPaymentPayload,
  fullQuote: FullQuoteResponse,
  mode: CoalitionFlowMode,
): void {
  const breakdown = fullQuote.fullQuote.monthlyPriceBreakdown;

  expect(paymentPayload.quoteId).toBe(fullQuote.fullQuote.id);
  expect(paymentPayload.paymentMethodId).toMatch(/^pm_/);
  expect(paymentPayload.expectedPrice).toBeGreaterThan(0);

  if (mode === 'monthly') {
    expect(paymentPayload.expectedPrice).toBe(
      breakdown.monthlyBreakdown?.firstInstallmentPayable,
    );
  } else {
    expect(paymentPayload.expectedPrice).toBe(breakdown.clientPayable);
  }
}

export function expectCoalitionQuoteDocsPayload(
  payload: { quoteId: string; email: string },
  fullQuote: FullQuoteResponse,
): void {
  expect(payload.quoteId).toBe(fullQuote.fullQuote.id);
  expect(payload.email).toBeTruthy();
}

export function expectCoalitionPaymentResponse(body: unknown): void {
  expect(body).toBeDefined();
  expect(body).not.toHaveProperty('statusCode');
}
