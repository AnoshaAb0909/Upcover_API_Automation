export interface VizOccupationInput {
  occupationId: string;
  secondDeclaration: boolean;
}

export interface VizClientInformation {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface VizQuickQuotePayload {
  companyRevenue: number;
  clientInformation: VizClientInformation;
  occupations: VizOccupationInput[];
  state: string;
  aggregateLimit: number;
  excess: number;
  partnerId: string;
}
