import { apiClient } from '../../../core/client/apiClient';
import { postWithPaymentRetry } from '../../../core/payments/postWithPaymentRetry';
import { env } from '../../../core/config/env';
import type {
  VizEndorsementAnnualPaymentPayload,
  VizEndorsementMonthlyPaymentPayload,
  VizEndorsementPayload,
} from '../types/endorsement.payload.types';
import type { Response } from 'supertest';

export async function createVizEndorsement(
  payload: VizEndorsementPayload,
): Promise<Response> {
  return apiClient.post(env.vizEndorsementPath).send(payload);
}

export async function createVizEndorsementMonthlyPayment(
  payload: VizEndorsementMonthlyPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('Viz endorsement monthly payment', () =>
    apiClient.post(env.vizEndorsementMonthlyPaymentsPath).send(payload),
  );
}

function resolveApprovalRequiredExpectedPrice(response: Response): number | undefined {
  if (response.status !== 451 || response.body?.errorCode !== 'approval-required') {
    return undefined;
  }

  const priceChange = response.body.changes?.find(
    (change: { name?: string; newValue?: number }) => change.name === 'expectedPrice',
  );

  return priceChange?.newValue;
}

/** Retries with the API-provided price when endorsement payment returns 451 approval-required. */
export async function createVizEndorsementMonthlyPaymentWithApproval(
  payload: VizEndorsementMonthlyPaymentPayload,
): Promise<Response> {
  let response = await createVizEndorsementMonthlyPayment(payload);
  const approvedPrice = resolveApprovalRequiredExpectedPrice(response);

  if (approvedPrice === undefined) {
    return response;
  }

  return createVizEndorsementMonthlyPayment({
    ...payload,
    expectedPrice: approvedPrice,
  });
}

export async function createVizEndorsementAnnualPayment(
  payload: VizEndorsementAnnualPaymentPayload,
): Promise<Response> {
  return postWithPaymentRetry('Viz endorsement annual payment', () =>
    apiClient.post(env.vizEndorsementPaymentsPath).send(payload),
  );
}

export async function createVizEndorsementAnnualPaymentWithApproval(
  payload: VizEndorsementAnnualPaymentPayload,
): Promise<Response> {
  let response = await createVizEndorsementAnnualPayment(payload);
  const approvedPrice = resolveApprovalRequiredExpectedPrice(response);

  if (approvedPrice === undefined) {
    return response;
  }

  return createVizEndorsementAnnualPayment({
    ...payload,
    expectedPrice: approvedPrice,
  });
}
