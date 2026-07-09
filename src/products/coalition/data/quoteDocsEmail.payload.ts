import { mapFullQuoteResponseToQuoteDocsEmailPayload } from './quoteDocsEmail.mapper';
import type { QuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';

export {
  mapFullQuoteResponseToQuoteDocsEmailPayload,
  resolveQuoteDocsEmail,
  resolveQuoteDocsQuoteId,
} from './quoteDocsEmail.mapper';

export function buildQuoteDocsEmailPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<QuoteDocsEmailPayload> = {},
): QuoteDocsEmailPayload {
  return mapFullQuoteResponseToQuoteDocsEmailPayload(fullQuote, overrides);
}
