import type { QuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';
import { COALITION_NOTIFICATION_EMAIL } from './coalitionNotificationEmail';

export const QUOTE_DOCS_EMAIL = COALITION_NOTIFICATION_EMAIL;

export function resolveQuoteDocsEmail(_fullQuote: FullQuoteResponse): string {
  return QUOTE_DOCS_EMAIL;
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
