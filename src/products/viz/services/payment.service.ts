import { apiClient } from '../../../core/client/apiClient';
import { postWithPaymentRetry } from '../../../core/payments/postWithPaymentRetry';
import { env } from '../../../core/config/env';
import type {
  VizAnnualPaymentPayload,
  VizMonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { Response } from 'supertest';

export async function createVizAnnualPayment(
  payload: VizAnnualPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('Viz annual payment', () =>
    apiClient.post(env.vizPaymentsPath).send(payload),
  );
}

export async function createVizMonthlyPayment(
  payload: VizMonthlyPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('Viz monthly payment', () =>
    apiClient.post(env.vizMonthlyPaymentsPath).send(payload),
  );
}
