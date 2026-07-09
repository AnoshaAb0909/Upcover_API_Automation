import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type { VizQuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { Response } from 'supertest';

export async function emailVizQuoteDocs(
  payload: VizQuoteDocsEmailPayload,
): Promise<Response> {
  return apiClient
    .post(env.vizQuoteDocsEmailPath, env.quoteDocsTimeout)
    .send(payload);
}
