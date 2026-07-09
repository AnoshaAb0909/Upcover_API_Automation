import type { QuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';

export function resolveQuoteDocsEmail(fullQuote: FullQuoteResponse): string {
  const email = fullQuote.fullQuote.req.clientInformation.email;

  if (!email) {
    throw new Error('Full quote response is missing req.clientInformation.email');
  }

  return email;
}

export function resolveQuoteDocsQuoteId(fullQuote: FullQuoteResponse): string {
  return fullQuote.fullQuote.id;
}

export function mapFullQuoteResponseToQuoteDocsEmailPayload(
  fullQuote: FullQuoteResponse,
  overrides: Partial<QuoteDocsEmailPayload> = {},
): QuoteDocsEmailPayload {
  return {
    email: resolveQuoteDocsEmail(fullQuote),
    quoteId: resolveQuoteDocsQuoteId(fullQuote),
    ...overrides,
  };
}
