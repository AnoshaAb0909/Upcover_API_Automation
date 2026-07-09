export type { QuoteDocsEmailPayload } from './quoteDocsEmail.payload.types';

export interface QuoteDocsEmailResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}
