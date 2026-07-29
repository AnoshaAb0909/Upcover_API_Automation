import {
  buildAhpFullQuotePayload,
  buildAhpMonthlyFullQuotePayload,
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
import { buildAhpQuickQuotePayload } from '../../../products/ahp/data/quickQuote.payload';
import {
  buildMockAhpFullQuoteResponse,
  buildMockAhpQuickQuoteResponse,
  mockAhpPolicyRequestId,
} from '../../helpers/ahpMockFixtures';

describe('AHP quick quote payload mapping', () => {
  it('should keep default occupation, state, revenue, and cover limits', () => {
    const payload = buildAhpQuickQuotePayload();

    expect(payload.occupations[0].id).toBe('595ab40a-588d-4e0e-8090-347f50cc094e');
    expect(payload.states[0].id).toBe('e5384a75-8180-4d4c-9859-8e84f4ddb36f');
    expect(payload.averageRevenue).toBe(3433);
    expect(payload.coverInput[0].limits).toEqual([
      { name: 'MM-Professional Indemnity', value: 1000000 },
      { name: 'MM-Public & Products Liability', value: 10000000 },
    ]);
  });
});

describe('AHP full quote payload mapping', () => {
  const quickQuote = buildMockAhpQuickQuoteResponse();
  const quickQuoteRequest = buildAhpQuickQuotePayload();

  it('should map annual full quote fields from quick quote', () => {
    const payload = buildAhpFullQuotePayload(quickQuote, quickQuoteRequest);

    expect(payload.quoteId).toBe(mockAhpPolicyRequestId);
    expect(payload.isMonthlySubscription).toBe(false);
    expect(payload.email).toContain('@upcover.com');
    expect(payload.companyName).toContain('PTY LTD');
  });

  it('should map monthly full quote fields from quick quote', () => {
    const payload = buildAhpMonthlyFullQuotePayload(quickQuote, quickQuoteRequest);

    expect(payload.quoteId).toBe(resolveAhpQuickQuoteId(quickQuote));
    expect(payload.isMonthlySubscription).toBe(true);
    expect(payload.occupations[0].name).toBe('Light/Heat Therapy');
    expect(payload.statesSplit[0].name).toBe('NSW');
  });
});

describe('AHP payment payload mapping', () => {
  const fullQuote = buildMockAhpFullQuoteResponse();

  it('should resolve full quote id and annual client payable', () => {
    expect(resolveAhpFullQuoteId(fullQuote)).toBe(mockAhpPolicyRequestId);
    expect(resolveAhpAnnualClientPayable(fullQuote)).toBe(324.12);
  });

  it('should resolve monthly client payable and first installment payable', () => {
    expect(resolveAhpMonthlyClientPayable(fullQuote)).toBe(324.12);
    expect(resolveAhpFirstInstallmentPayable(fullQuote)).toBe(32.41);
    expect(resolveAhpFirstInstallmentPayable(fullQuote)).toBeLessThan(
      resolveAhpMonthlyClientPayable(fullQuote),
    );
  });

  it('should map annual payment payload from full quote response', () => {
    const payload = mapAhpFullQuoteResponseToAnnualPaymentPayload(fullQuote, {
      paymentMethodId: 'pm_test_annual',
    });

    expect(payload.quoteId).toBe(mockAhpPolicyRequestId);
    expect(payload.expectedPrice).toBe(324.12);
    expect(payload.paymentMethodId).toBe('pm_test_annual');
  });

  it('should map monthly payment payload from full quote response', () => {
    const payload = mapAhpFullQuoteResponseToMonthlyPaymentPayload(fullQuote, {
      paymentMethodId: 'pm_test_monthly',
    });

    expect(payload.quoteId).toBe(mockAhpPolicyRequestId);
    expect(payload.expectedPrice).toBe(32.41);
    expect(payload.paymentMethodId).toBe('pm_test_monthly');
  });
});
