import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type { VizProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { Response } from 'supertest';

export async function emailVizProofOfInsurance(
  payload: VizProofOfInsuranceEmailPayload,
): Promise<Response> {
  return apiClient
    .post(env.vizProofOfInsuranceEmailPath, env.quoteDocsTimeout)
    .send(payload);
}
