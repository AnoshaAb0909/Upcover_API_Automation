import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type { QuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { Response } from 'supertest';

export async function emailQuoteDocs(
  payload: QuoteDocsEmailPayload,
): Promise<Response> {
  return apiClient
    .post(env.coalitionQuoteDocsEmailPath, env.quoteDocsTimeout)
    .send(payload);
}
