import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type {
  VizAnnualPaymentPayload,
  VizMonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { Response } from 'supertest';

export async function createVizAnnualPayment(
  payload: VizAnnualPaymentPayload,
): Promise<Response> {
  return apiClient.post(env.vizPaymentsPath).send(payload);
}

export async function createVizMonthlyPayment(
  payload: VizMonthlyPaymentPayload,
): Promise<Response> {
  return apiClient.post(env.vizMonthlyPaymentsPath).send(payload);
}
