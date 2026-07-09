import { mapVizFullQuoteResponseToQuoteDocsEmailPayload } from './quoteDocsEmail.mapper';
import type { VizQuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';

export {
  mapVizFullQuoteResponseToQuoteDocsEmailPayload,
  resolveVizQuoteDocsEmail,
  resolveVizQuoteDocsQuoteId,
} from './quoteDocsEmail.mapper';

export function buildVizQuoteDocsEmailPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizQuoteDocsEmailPayload> = {},
): VizQuoteDocsEmailPayload {
  return mapVizFullQuoteResponseToQuoteDocsEmailPayload(fullQuote, overrides);
}
