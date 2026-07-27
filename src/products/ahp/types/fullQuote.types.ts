import type { AhpQuickQuoteResponse } from './quickQuote.types';

export interface AhpFullQuoteResponseBody {
  quote: AhpQuickQuoteResponse;
  monthlyPriceBreakdown?: Record<string, unknown>;
  installmentDates?: unknown;
  changes?: unknown[];
}
