import { apiClient } from '../../../core/client/apiClient';
import { env } from '../../../core/config/env';
import type {
  AnnualPaymentPayload,
  MonthlyPaymentPayload,
} from '../types/payment.payload.types';
import type { Response } from 'supertest';

export async function createAnnualPayment(
  payload: AnnualPaymentPayload,
): Promise<Response> {
  return apiClient.post(env.coalitionPaymentsPath).send(payload);
}

export async function createMonthlyPayment(
  payload: MonthlyPaymentPayload,
): Promise<Response> {
  return apiClient.post(env.coalitionMonthlyPaymentsPath).send(payload);
}

/** @deprecated Use createAnnualPayment */
export const createPayment = createAnnualPayment;
