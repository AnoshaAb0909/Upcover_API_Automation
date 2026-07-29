import { apiClient } from '../../../core/client/apiClient';
import { refreshGuestAuth } from '../../../core/auth/guestLogin';
import { env } from '../../../core/config/env';
import type { VizProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { Response } from 'supertest';

const POI_EMAIL_RETRY_DELAY_MS = 10_000;
const POI_EMAIL_MAX_ATTEMPTS = 12;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryablePoiEmailStatus(status: number): boolean {
  return status === 500 || status === 502 || status === 503;
}

async function postVizProofOfInsuranceEmail(
  payload: VizProofOfInsuranceEmailPayload,
): Promise<Response> {
  await refreshGuestAuth();

  return apiClient
    .post(env.vizProofOfInsuranceEmailPath, env.quoteDocsTimeout)
    .send(payload);
}

/**
 * Viz proof-of-insurance email can fail transiently while policy docs are generated.
 * Retry on 5xx responses (same pattern as Coalition/Viz quote docs).
 */
export async function emailVizProofOfInsurance(
  payload: VizProofOfInsuranceEmailPayload,
): Promise<Response> {
  let response = await postVizProofOfInsuranceEmail(payload);

  for (
    let attempt = 1;
    attempt < POI_EMAIL_MAX_ATTEMPTS && isRetryablePoiEmailStatus(response.status);
    attempt += 1
  ) {
    console.warn(
      `Viz proof of insurance email returned ${response.status} for ${payload.policyRequestId} — retry ${attempt}/${POI_EMAIL_MAX_ATTEMPTS - 1} in ${POI_EMAIL_RETRY_DELAY_MS}ms`,
    );
    await sleep(POI_EMAIL_RETRY_DELAY_MS);
    response = await postVizProofOfInsuranceEmail(payload);
  }

  return response;
}
