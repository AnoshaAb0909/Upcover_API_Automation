import { apiClient } from '../../../core/client/apiClient';
import { refreshGuestAuth } from '../../../core/auth/guestLogin';
import { env } from '../../../core/config/env';
import type { QuoteDocsEmailPayload } from '../types/quoteDocsEmail.payload.types';
import type { Response } from 'supertest';

const QUOTE_DOCS_RETRY_DELAY_MS = 10_000;
const QUOTE_DOCS_MAX_ATTEMPTS = 12;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableQuoteDocsStatus(status: number): boolean {
  return status === 500 || status === 502 || status === 503;
}

async function postQuoteDocsEmail(payload: QuoteDocsEmailPayload): Promise<Response> {
  await refreshGuestAuth();

  return apiClient
    .post(env.coalitionQuoteDocsEmailPath, env.quoteDocsTimeout)
    .send(payload);
}

/**
 * Coalition quote docs can return 500 immediately after full quote creation.
 * Retry until the quote is ready on the backend (observed ~30s on dev).
 */
export async function emailQuoteDocs(
  payload: QuoteDocsEmailPayload,
): Promise<Response> {
  let response = await postQuoteDocsEmail(payload);

  for (
    let attempt = 1;
    attempt < QUOTE_DOCS_MAX_ATTEMPTS && isRetryableQuoteDocsStatus(response.status);
    attempt += 1
  ) {
    console.warn(
      `Quote docs email returned ${response.status} for ${payload.quoteId} — retry ${attempt}/${QUOTE_DOCS_MAX_ATTEMPTS - 1} in ${QUOTE_DOCS_RETRY_DELAY_MS}ms`,
    );
    await sleep(QUOTE_DOCS_RETRY_DELAY_MS);
    response = await postQuoteDocsEmail(payload);
  }

  return response;
}
