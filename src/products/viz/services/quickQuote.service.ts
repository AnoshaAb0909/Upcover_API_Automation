import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import { buildVizQuickQuotePayload } from '../data/quickQuote.payload';
import type { VizQuickQuotePayload } from '../types/quickQuote.payload.types';
import type { Response } from 'supertest';

export async function createVizQuickQuote(
  payload: VizQuickQuotePayload,
): Promise<Response> {
  return apiClient.post(env.vizQuickQuotePath).send(payload);
}

export async function createVizQuickQuoteWithRetry(
  buildPayload: () => VizQuickQuotePayload = buildVizQuickQuotePayload,
  options: { maxAttempts?: number } = {},
): Promise<Response> {
  const maxAttempts = options.maxAttempts ?? 3;
  let response = await createVizQuickQuote(buildPayload());

  for (let attempt = 1; attempt < maxAttempts; attempt += 1) {
    if (response.status !== 400) {
      break;
    }

    response = await createVizQuickQuote(buildPayload());
  }

  return response;
}
