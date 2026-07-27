import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type { AhpFullQuotePayload } from '../types/fullQuote.payload.types';
import type { Response } from 'supertest';

export async function createAhpFullQuote(
  payload: AhpFullQuotePayload,
): Promise<Response> {
  return apiClient.post(env.ahpFullQuotePath).send(payload);
}
