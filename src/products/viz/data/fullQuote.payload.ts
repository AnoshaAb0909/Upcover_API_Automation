import { mapVizQuickQuoteResponseToFullQuotePayload } from './fullQuote.mapper';
import type { VizFullQuotePayload } from '../types/fullQuote.payload.types';
import type { VizQuickQuoteResponse } from '../types/quickQuote.types';

export {
  mapVizQuickQuoteResponseToFullQuotePayload,
  resolveVizQuickQuoteId,
} from './fullQuote.mapper';

export function buildVizFullQuotePayload(
  quickQuote: VizQuickQuoteResponse,
  options: {
    overrides?: Partial<VizFullQuotePayload>;
    isMonthlySubscription?: boolean;
  } = {},
): VizFullQuotePayload {
  return mapVizQuickQuoteResponseToFullQuotePayload(quickQuote, options);
}

export function buildVizMonthlyFullQuotePayload(
  quickQuote: VizQuickQuoteResponse,
  overrides: Partial<VizFullQuotePayload> = {},
): VizFullQuotePayload {
  return mapVizQuickQuoteResponseToFullQuotePayload(quickQuote, {
    isMonthlySubscription: true,
    overrides,
  });
}
