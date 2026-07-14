import type { VizQuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';
import { VIZ_NOTIFICATION_EMAIL } from './vizNotificationEmail';

export const QUOTE_DOCS_EMAIL = VIZ_NOTIFICATION_EMAIL;

export function resolveVizQuoteDocsEmail(_fullQuote: VizFullQuoteResponse): string {
  return QUOTE_DOCS_EMAIL;
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
