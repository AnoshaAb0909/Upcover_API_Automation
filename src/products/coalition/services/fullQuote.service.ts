import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type { FullQuotePayload } from '../types/fullQuote.payload.types';
import type { Response } from 'supertest';

const TOI_SCAN_MESSAGE = 'TOI scan in progress';

function isToiScanInProgress(response: Response): boolean {
  const message = String(response.body?.message ?? '');
  return response.status === 500 && message.includes(TOI_SCAN_MESSAGE);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createFullQuote(
  payload: FullQuotePayload,
  options: { maxRetries?: number; retryDelayMs?: number } = {},
): Promise<Response> {
  const maxRetries = options.maxRetries ?? 12;
  const retryDelayMs = options.retryDelayMs ?? 15000;

  let response = await apiClient.post(env.coalitionFullQuotePath).send(payload);

  for (let attempt = 0; attempt < maxRetries && isToiScanInProgress(response); attempt++) {
    await sleep(retryDelayMs);
    response = await apiClient.post(env.coalitionFullQuotePath).send(payload);
  }

  return response;
}
