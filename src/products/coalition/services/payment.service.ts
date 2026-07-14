import { apiClient } from '../../../core/client/apiClient';
import { postWithPaymentRetry } from '../../../core/payments/postWithPaymentRetry';
import { env } from '../../../core/config/env';
import type {
  AnnualPaymentPayload,
  MonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { Response } from 'supertest';

export async function createAnnualPayment(
  payload: AnnualPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('Coalition annual payment', () =>
    apiClient.post(env.coalitionPaymentsPath).send(payload),
  );
}

export async function createMonthlyPayment(
  payload: MonthlyPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('Coalition monthly payment', () =>
    apiClient.post(env.coalitionMonthlyPaymentsPath).send(payload),
  );
}

/** @deprecated Use createAnnualPayment */
export const createPayment = createAnnualPayment;
