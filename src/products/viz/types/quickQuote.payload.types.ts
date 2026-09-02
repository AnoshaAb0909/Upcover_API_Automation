export interface VizOccupationInput {
  occupationId: string;
  secondDeclaration?: boolean;
}

export interface VizDeclarationInput {
  id: string;
  answer: boolean;
}

export interface VizClientInformation {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface VizQuickQuotePayload {
  companyRevenue: number;
  occupations: Array<{ occupationId: string }>;
  declarations: VizDeclarationInput[];
  state: string;
  aggregateLimit: number;
  excess: number;
  isMonthlySubscription?: boolean;
}
