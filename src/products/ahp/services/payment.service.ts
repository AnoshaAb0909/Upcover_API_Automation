import { apiClient } from '../../../core/client/apiClient';
import { postWithPaymentRetry } from '../../../core/payments/postWithPaymentRetry';
import { env } from '../../../core/config/env';
import type {
  AhpAnnualPaymentPayload,
  AhpMonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { Response } from 'supertest';

export async function createAhpAnnualPayment(
  payload: AhpAnnualPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('AHP annual payment', () =>
    apiClient.post(env.ahpPaymentsPath).send(payload),
  );
}

export async function createAhpMonthlyPayment(
  payload: AhpMonthlyPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('AHP monthly payment', () =>
    apiClient.post(env.ahpMonthlyPaymentsPath).send(payload),
  );
}
