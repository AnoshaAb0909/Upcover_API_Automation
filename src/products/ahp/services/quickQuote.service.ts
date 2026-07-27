import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import { buildAhpQuickQuotePayload } from '../data/quickQuote.payload';
import type { AhpQuickQuotePayload } from '../types/quickQuote.payload.types';
import type { Response } from 'supertest';

export async function createAhpQuickQuote(
  payload: AhpQuickQuotePayload,
): Promise<Response> {
  return apiClient.post(env.ahpQuickQuotePath).send(payload);
}

export async function createAhpQuickQuoteWithRetry(
  buildPayload: () => AhpQuickQuotePayload = buildAhpQuickQuotePayload,
  options: { maxAttempts?: number } = {},
): Promise<Response> {
  const maxAttempts = options.maxAttempts ?? 3;
  let response = await createAhpQuickQuote(buildPayload());

  for (let attempt = 1; attempt < maxAttempts; attempt += 1) {
    if (response.status !== 400) {
      break;
    }

    response = await createAhpQuickQuote(buildPayload());
  }

  return response;
}
