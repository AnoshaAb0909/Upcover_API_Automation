import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import { coalitionTestCompanies } from '../data/coalitionTestCompanies';
import { buildQuickQuotePayload } from '../data/quickQuote.payload';
import type { QuickQuotePayload } from '../types/quickQuote.payload.types';
import type { Response } from 'supertest';

function isReferralDenied(response: Response): boolean {
  return (
    response.status === 400 && response.body?.errorCode === 'referral'
  );
}

function isTransientCoalitionFailure(response: Response): boolean {
  if (response.status !== 500) {
    return false;
  }

  const message = String(response.body?.message ?? '');
  return (
    message.includes('TOI scan in progress') ||
    message.includes('Request to coalition failed')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createQuickQuote(
  payload: QuickQuotePayload,
): Promise<Response> {
  return apiClient.post(env.coalitionQuickQuotePath).send(payload);
}

/**
 * Retries quick quote when Coalition returns referral denial (next real test company)
 * or a transient 500 (TOI scan / partner request failed) with the same payload.
 */
export async function createQuickQuoteWithRetry(
  buildPayload: () => QuickQuotePayload = buildQuickQuotePayload,
  options: {
    maxAttempts?: number;
    maxTransientRetries?: number;
    retryDelayMs?: number;
  } = {},
): Promise<Response> {
  const maxAttempts =
    options.maxAttempts ?? coalitionTestCompanies.length + 2;
  const maxTransientRetries = options.maxTransientRetries ?? 5;
  const retryDelayMs = options.retryDelayMs ?? 15000;
  let payload = buildPayload();
  let response = await createQuickQuote(payload);
  let transientRetries = 0;

  for (let attempt = 1; attempt < maxAttempts; attempt += 1) {
    if (isTransientCoalitionFailure(response)) {
      if (transientRetries >= maxTransientRetries) {
        break;
      }

      transientRetries += 1;
      await sleep(retryDelayMs);
      response = await createQuickQuote(payload);
      continue;
    }

    if (isReferralDenied(response)) {
      payload = buildPayload();
      response = await createQuickQuote(payload);
      continue;
    }

    break;
  }

  return response;
}
