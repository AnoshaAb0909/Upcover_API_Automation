export interface MotorTotFullQuoteSignOff {
  fullName: string;
  date: string;
  position: string;
}

export interface MotorTotFullQuoteDeclarations {
  insurerCancelledOrDeclined: string;
  criminalOffenceHistory: string;
  signOff: MotorTotFullQuoteSignOff;
}

export interface MotorTotFullQuotePayload {
  quoteId: string;
  declarations: MotorTotFullQuoteDeclarations;
}
