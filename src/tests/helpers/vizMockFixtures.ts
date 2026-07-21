import { vizEndorsementAnnualFullQuoteTemplate } from '../../products/viz/data/endorsement.fullQuote.defaults';
import type { VizEndorsementResponse } from '../../products/viz/types/endorsement.payload.types';
import type { VizFullQuoteResponse } from '../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../products/viz/types/quickQuote.types';

export const mockVizClientInformation = {
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '0412345678',
  email: 'qa-automation@upcover.com',
};

export function buildMockVizQuickQuoteResponse(
  overrides: Partial<VizQuickQuoteResponse> = {},
): VizQuickQuoteResponse {
  return {
    id: 'viz_mock-quick-quote-id',
    partnerId: 'upcover',
    req: {
      companyRevenue: 2500000,
      state: 'NSW',
      aggregateLimit: 5000000,
      excess: 500,
      partnerId: 'upcover',
      clientInformation: mockVizClientInformation,
      occupations: [
        {
          occupationId: '51a52b8b-6119-4256-93ea-31e795d0b8fe',
          secondDeclaration: false,
        },
      ],
    },
    ...overrides,
  };
}

export function buildMockVizFullQuoteResponse(
  overrides: Partial<VizFullQuoteResponse> = {},
): VizFullQuoteResponse {
  const quoteId = 'viz_mock-bound-policy-id';

  return {
    fullQuote: {
      id: quoteId,
      type: 'fullQuote',
      isMonthlySubscription: false,
      priceBreakdown: {
        clientPayable: 1234.56,
        monthlyBreakdown: {
          firstInstallmentPayable: 164.77,
        },
      },
      req: {
        quoteId,
        ...vizEndorsementAnnualFullQuoteTemplate,
        policyStartDate: '2026-07-21T00:00:00.000Z',
        policyExpiryDate: '2027-07-21T00:00:00.000Z',
        clientInformation: mockVizClientInformation,
        metadata: { quoteId },
      },
    },
    ...overrides,
  };
}

export function buildMockVizEndorsementResponse(
  overrides: Partial<VizEndorsementResponse> = {},
): VizEndorsementResponse {
  const quoteId = 'viz_mock-endorsement-quote-id';

  return {
    fullQuote: {
      id: quoteId,
      type: 'fullQuote',
      isMonthlySubscription: false,
      priceBreakdown: {
        clientPayable: 751.33,
      },
      req: {
        parentQuoteId: 'viz_mock-bound-policy-id',
        ...vizEndorsementAnnualFullQuoteTemplate,
        endorsementEffectiveDate: '2026-07-21',
        isCouponApplied: false,
        policyStartDate: '2026-07-21',
        policyExpiryDate: '2027-07-21',
        clientInformation: mockVizClientInformation,
        metadata: {
          flow: 'endorsement',
          quoteId: 'viz_mock-bound-policy-id',
        },
      },
    },
    ...overrides,
  };
}
