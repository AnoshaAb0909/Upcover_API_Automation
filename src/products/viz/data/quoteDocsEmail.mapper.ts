import type { VizQuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';

export function resolveVizQuoteDocsEmail(fullQuote: VizFullQuoteResponse): string {
  const email = fullQuote.fullQuote.req.clientInformation.email;

  if (!email) {
    throw new Error('Full quote response is missing req.clientInformation.email');
  }

  return email;
}

export function resolveVizQuoteDocsQuoteId(fullQuote: VizFullQuoteResponse): string {
  return fullQuote.fullQuote.id;
}

export function mapVizFullQuoteResponseToQuoteDocsEmailPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizQuoteDocsEmailPayload> = {},
): VizQuoteDocsEmailPayload {
  return {
    email: resolveVizQuoteDocsEmail(fullQuote),
    quoteId: resolveVizQuoteDocsQuoteId(fullQuote),
    ...overrides,
  };
}
