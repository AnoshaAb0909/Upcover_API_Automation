import type { MotorTotFullQuotePayload } from '../types/fullQuote.payload.types';

export const defaultMotorTotFullQuoteDeclarations: MotorTotFullQuotePayload['declarations'] =
  {
    insurerCancelledOrDeclined: 'NO',
    criminalOffenceHistory: 'NO',
    signOff: {
      fullName: 'Umer Sajjad',
      date: '14/03/2026',
      position: 'Developer',
    },
  };
