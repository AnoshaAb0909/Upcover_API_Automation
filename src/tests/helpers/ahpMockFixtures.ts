import type { AhpFullQuoteResponseBody } from '../../products/ahp/types/fullQuote.types';
import type { AhpQuickQuoteResponse } from '../../products/ahp/types/quickQuote.types';

export const mockAhpPolicyRequestId = 'a45c5ced-b00d-40fe-9540-800180eef9f8';

export function buildMockAhpQuickQuoteResponse(
  overrides: Partial<AhpQuickQuoteResponse> = {},
): AhpQuickQuoteResponse {
  return {
    policyRequestId: mockAhpPolicyRequestId,
    requestTypeId: 0,
    referenceNumber: 'VAAISS-1',
    policyNumbers: null,
    policyStatusId: 9,
    totalPremium: [
      {
        coverId: '18abdef3-92af-404a-83f9-fdb451df52a7',
        title: 'Healthcare Professionals Civil Liability (PI & PL)',
        premium: {
          basePremium: 220,
          gst: 22,
          stampDuty: 16.12,
          underwriterFee: 0,
          underwriterFeeGst: 0,
          brokerFee: 60,
          brokerFeeGst: 6,
          clientPayable: 324.12,
          netPayable: 221.82,
        },
      },
    ],
    referralDeclineReasons: [],
    coverInputs: [
      {
        id: '18abdef3-92af-404a-83f9-fdb451df52a7',
        preferredLimit: 1000000,
        excess: 500,
        coverSectionLimits: [],
      },
    ],
    ...overrides,
  };
}

export function buildMockAhpFullQuoteResponse(
  overrides: Partial<AhpFullQuoteResponseBody> = {},
): AhpFullQuoteResponseBody {
  const quote = buildMockAhpQuickQuoteResponse();

  return {
    quote,
    monthlyPriceBreakdown: {
      monthlyPriceBreakdown: {
        clientPayable: 324.12,
        monthlyInstallments: {
          payable: 32.41,
          clientPayable: 324.12,
        },
      },
    },
    installmentDates: ['29/07/2026', '30/08/2026'],
    changes: [],
    ...overrides,
  };
}
