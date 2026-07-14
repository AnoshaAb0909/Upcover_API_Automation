import { apiClient } from '../../../core/client/apiClient';
import { refreshGuestAuth } from '../../../core/auth/guestLogin';
import { env } from '../../../core/config/env';
import type { VizQuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { Response } from 'supertest';

export async function emailVizQuoteDocs(
  payload: VizQuoteDocsEmailPayload,
): Promise<Response> {
  await refreshGuestAuth();

  return apiClient
    .post(env.vizQuoteDocsEmailPath, env.quoteDocsTimeout)
    .send(payload);
}
