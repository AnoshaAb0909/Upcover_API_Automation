import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type { VizFullQuotePayload } from '../types/fullQuote.payload.types';
import type { Response } from 'supertest';

export async function createVizFullQuote(
  payload: VizFullQuotePayload,
): Promise<Response> {
  return apiClient.post(env.vizFullQuotePath).send(payload);
}
