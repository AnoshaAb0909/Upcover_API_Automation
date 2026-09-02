import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type { AhpFullQuotePayload } from '../types/fullQuote.payload.types';
import type { Response } from 'supertest';

const REFERRAL_IN_PROGRESS_MESSAGE = 'still in progress';

function isReferralInProgress(response: Response): boolean {
  const errorCode = String(response.body?.errorCode ?? '');
  const message = String(response.body?.message ?? '').toLowerCase();

  return (
    response.status === 400 &&
    errorCode === 'referral' &&
    message.includes(REFERRAL_IN_PROGRESS_MESSAGE)
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createAhpFullQuote(
  payload: AhpFullQuotePayload,
  options: { maxRetries?: number; retryDelayMs?: number } = {},
): Promise<Response> {
  const maxRetries = options.maxRetries ?? 12;
  const retryDelayMs = options.retryDelayMs ?? 15000;

  let response = await apiClient.post(env.ahpFullQuotePath).send(payload);

  for (
    let attempt = 0;
    attempt < maxRetries && isReferralInProgress(response);
    attempt += 1
  ) {
    await sleep(retryDelayMs);
    response = await apiClient.post(env.ahpFullQuotePath).send(payload);
  }

  return response;
}
