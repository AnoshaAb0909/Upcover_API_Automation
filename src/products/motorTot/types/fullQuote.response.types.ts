export interface MotorTotFullQuoteResponse {
  id: string;
  type: 'full-quote';
  status: 'full-quote-generated';
  quoteNumber: string;
  insureMoProposalId?: string;
  req: {
    clientId: string;
    clientInformation: {
      email: string;
    };
    vehicles: unknown[];
  };
  res: {
    status: string;
    proposalNo: string;
    policy: {
      transactionStatusCode: string;
      numberOfVehicles: number;
    };
    premium: {
      totalPremium: number;
    };
    declarations: {
      insurerCancelledOrDeclined: string;
      criminalOffenceHistory: string;
      driversLicenseSuspended: string;
    };
  };
}
