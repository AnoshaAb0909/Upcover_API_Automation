export interface MotorTotQuickQuotePremiumSummary {
  basePremium: number;
  fireEmergencyLevy: number;
  gst: number;
  stampDuty: number;
  totalPremium: number;
}

export interface MotorTotQuickQuoteResponse {
  id: string;
  type: 'quick-quote';
  status: 'indicative-quote-generated';
  quoteNumber: string;
  insureMoProposalId: string;
  isMonthlySubscription: boolean;
  createdAt: string;
  updatedAt: string;
  annualPremium: MotorTotQuickQuotePremiumSummary;
  monthlyPremium: MotorTotQuickQuotePremiumSummary;
  req: {
    clientId: string;
    clientInformation: {
      email: string;
      firstName: string;
      lastName: string;
    };
    vehicles: unknown[];
  };
  rmDetails: {
    email: string;
    userId: string;
  };
  res: {
    proposalNo: string;
    status: string;
    policy: {
      proposalNo: string;
      transactionStatusCode: string;
      numberOfVehicles: number;
    };
    premium: {
      totalPremium: number;
      grossPremium: number;
    };
    vehicles: unknown[];
  };
}
