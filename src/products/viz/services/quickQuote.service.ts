import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import { buildVizQuickQuotePayload } from '../data/quickQuote.payload';
import type { VizQuickQuotePayload } from '../types/quickQuote.payload.types';
import type { Response } from 'supertest';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientVizGatewayFailure(response: Response): boolean {
  return (
    response.status === 500 ||
    response.status === 502 ||
    response.status === 503
  );
}

export async function createVizQuickQuote(
  payload: VizQuickQuotePayload,
): Promise<Response> {
  return apiClient.post(env.vizQuickQuotePath).send(payload);
}

/**
 * Retries quick quote on 400 (rotate payload) or a transient gateway
 * 500/502/503 (empty body / partner blip). Same pattern as Coalition QQ.
 */
export async function createVizQuickQuoteWithRetry(
  buildPayload: () => VizQuickQuotePayload = buildVizQuickQuotePayload,
  options: { maxAttempts?: number; retryDelayMs?: number } = {},
): Promise<Response> {
  const maxAttempts = options.maxAttempts ?? 5;
  const retryDelayMs = options.retryDelayMs ?? 10000;
  let response = await createVizQuickQuote(buildPayload());

  for (let attempt = 1; attempt < maxAttempts; attempt += 1) {
    if (isTransientVizGatewayFailure(response)) {
      console.warn(
        `Viz quick quote returned ${response.status} — retry ${attempt}/${maxAttempts - 1} in ${retryDelayMs}ms`,
      );
      await sleep(retryDelayMs);
      response = await createVizQuickQuote(buildPayload());
      continue;
    }

    if (response.status === 400) {
      response = await createVizQuickQuote(buildPayload());
      continue;
    }

    break;
  }

  return response;
}
