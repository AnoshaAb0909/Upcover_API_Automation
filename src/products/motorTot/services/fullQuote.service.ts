import { motorTotApiClient } from '../../../core/client/motorTotApiClient';
import { env } from '../../../core/config/env';
import type { MotorTotFullQuotePayload } from '../types/fullQuote.payload.types';
import type { Response } from 'supertest';

export async function createMotorTotFullQuote(
  payload: MotorTotFullQuotePayload,
): Promise<Response> {
  return motorTotApiClient.post(env.motorTotFullQuotePath).send(payload);
}
