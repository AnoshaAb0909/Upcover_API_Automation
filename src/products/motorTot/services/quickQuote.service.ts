import { motorTotApiClient } from '../../../core/client/motorTotApiClient';
import { env } from '../../../core/config/env';
import type { MotorTotQuickQuotePayload } from '../types/quickQuote.payload.types';
import type { Response } from 'supertest';

export async function createMotorTotQuickQuote(
  payload: MotorTotQuickQuotePayload,
  accessToken?: string,
): Promise<Response> {
  return motorTotApiClient
    .post(env.motorTotQuickQuotePath)
    .send(payload, accessToken);
}
