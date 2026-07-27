export {
  mapAhpQuickQuoteToFullQuotePayload,
  resolveAhpQuickQuoteId,
} from './fullQuote.mapper';

import { mapAhpQuickQuoteToFullQuotePayload } from './fullQuote.mapper';
import type { AhpFullQuotePayload } from '../types/fullQuote.payload.types';
import type { AhpQuickQuotePayload } from '../types/quickQuote.payload.types';
import type { AhpQuickQuoteResponse } from '../types/quickQuote.types';

export function buildAhpFullQuotePayload(
  quickQuote: AhpQuickQuoteResponse,
  quickQuoteRequest: AhpQuickQuotePayload,
  options: {
    overrides?: Partial<AhpFullQuotePayload>;
    clientInformation?: {
      firstName: string;
      lastName: string;
      email: string;
    };
    isMonthlySubscription?: boolean;
  } = {},
): AhpFullQuotePayload {
  return mapAhpQuickQuoteToFullQuotePayload(quickQuote, quickQuoteRequest, options);
}

export function buildAhpMonthlyFullQuotePayload(
  quickQuote: AhpQuickQuoteResponse,
  quickQuoteRequest: AhpQuickQuotePayload,
  options: {
    overrides?: Partial<AhpFullQuotePayload>;
    clientInformation?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  } = {},
): AhpFullQuotePayload {
  return mapAhpQuickQuoteToFullQuotePayload(quickQuote, quickQuoteRequest, {
    ...options,
    isMonthlySubscription: true,
  });
}
