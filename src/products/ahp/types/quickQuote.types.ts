import type { AhpQuickQuotePayload } from './quickQuote.payload.types';

export type { AhpQuickQuotePayload } from './quickQuote.payload.types';

export interface AhpPremiumBreakdown {
  basePremium: number;
  gst: number;
  fireServiceLevy?: number;
  stampDuty: number;
  underwriterFee: number;
  underwriterFeeGst: number;
  brokerFee: number;
  brokerFeeGst: number;
  clientPayable: number;
  netPayable: number;
  note?: string;
}

export interface AhpTotalPremiumItem {
  coverId: string;
  title: string;
  premium: AhpPremiumBreakdown;
  brokerCommission?: {
    percentage: number;
    commission: number;
    gst: number;
  };
}

export interface AhpCoverSectionLimit {
  sectionId: string;
  preferredLimit: number;
}

export interface AhpCoverInputResponse {
  id: string;
  preferredLimit: number;
  excess: number;
  coverSectionLimits: AhpCoverSectionLimit[];
}

export interface AhpQuickQuoteResponse {
  policyRequestId: string;
  requestTypeId: number;
  referenceNumber: string;
  policyNumbers: string | null;
  policyStatusId: number;
  totalPremium: AhpTotalPremiumItem[];
  referralDeclineReasons: unknown[];
  coverInputs: AhpCoverInputResponse[];
  monthlyPriceBreakdown?: Record<string, unknown>;
}
