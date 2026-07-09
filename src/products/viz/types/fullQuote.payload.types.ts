import type { VizClientInformation, VizOccupationInput } from './quickQuote.payload.types';

export interface VizCompanyAddress {
  street: string;
  city: string;
  country: string;
  administrativeArea: string;
  postcode: string;
  latitude: number;
  longitude: number;
  placeId: string;
  viewPort: {
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  };
}

export interface VizAbnDetails {
  abn: string;
  businessName: string;
  entityDescription: string;
  entityDate: string;
  state: string;
  postcode: string;
}

export interface VizToolItem {
  description: string;
  value: string;
}

export interface VizOptionalCover {
  include: boolean;
  excessAmount: number;
  items?: VizToolItem[];
}

export interface VizFullQuotePayload {
  quoteId: string;
  companyRevenue: number;
  companyName: string;
  companyAddress: VizCompanyAddress;
  abnDetails: VizAbnDetails;
  nswSdExempt: boolean;
  subContractorServiceEngagement: boolean;
  hasBusinessDeclarationIssues: boolean;
  state: string;
  clientInformation: VizClientInformation;
  aggregateLimit: number;
  excess: number;
  policyStartDate: string;
  policyExpiryDate: string;
  occupations: VizOccupationInput[];
  isMonthlySubscription: boolean;
  tools: VizOptionalCover;
  taxAudit: VizOptionalCover;
  metadata: {
    quoteId: string;
  };
}
