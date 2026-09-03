import { defaultMotorTotFullQuoteDeclarations } from './fullQuote.defaults';
import type { MotorTotFullQuotePayload } from '../types/fullQuote.payload.types';

export function buildMotorTotFullQuotePayload(
  quoteId: string,
  overrides: Partial<MotorTotFullQuotePayload> = {},
): MotorTotFullQuotePayload {
  return {
    ...overrides,
    quoteId: overrides.quoteId ?? quoteId,
    declarations: {
      ...defaultMotorTotFullQuoteDeclarations,
      ...overrides.declarations,
      signOff: {
        ...defaultMotorTotFullQuoteDeclarations.signOff,
        ...overrides.declarations?.signOff,
      },
    },
  };
}
