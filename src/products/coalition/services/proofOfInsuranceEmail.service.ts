import { apiClient } from '../../../core/client/apiClient';
import { refreshGuestAuth } from '../../../core/auth/guestLogin';
import { env } from '../../../core/config/env';
import type { ProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { Response } from 'supertest';

export async function emailProofOfInsurance(
  payload: ProofOfInsuranceEmailPayload,
): Promise<Response> {
  await refreshGuestAuth();

  return apiClient
    .post(env.coalitionProofOfInsuranceEmailPath, env.quoteDocsTimeout)
    .send(payload);
}
