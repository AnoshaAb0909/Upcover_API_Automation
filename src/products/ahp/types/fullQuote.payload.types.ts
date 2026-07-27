import type { AhpCoverInput } from './quickQuote.payload.types';

export interface AhpFullQuoteOccupation {
  occupationId: string;
  name: string;
  percentage: number;
}

export interface AhpFullQuoteAddress {
  addressLine1: string;
  suburb: string;
  state: string;
  postalCode: string;
  placeId: string;
  latitude: number;
  longitude: number;
}

export interface AhpStateSplit {
  name: string;
  percentage: number;
  id: string;
}

export interface AhpDeclaration {
  id: string;
  answer: string;
}

export interface AhpFullQuotePayload {
  quoteId: string;
  partnerId: string;
  occupations: AhpFullQuoteOccupation[];
  policyStartDate: string;
  insuredName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  address: AhpFullQuoteAddress;
  companyName: string;
  abn: string;
  entityDate: string;
  entityDescription: string;
  revenueLastFy: number;
  revenueCurrentFy: number;
  nswSdExempt: boolean;
  operatesInMultipleStates: boolean;
  statesSplit: AhpStateSplit[];
  declarations: AhpDeclaration[];
  numberOfEmployees: number;
  isMonthlySubscription: boolean;
  coverInput: AhpCoverInput[];
}
