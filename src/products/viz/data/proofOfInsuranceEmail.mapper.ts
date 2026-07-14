import type { VizProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';
import type { VizPaymentResponse } from '../types/payment.types';
import { VIZ_NOTIFICATION_EMAIL } from './vizNotificationEmail';

export const PROOF_OF_INSURANCE_EMAIL = VIZ_NOTIFICATION_EMAIL;

export function resolveVizProofOfInsuranceEmail(
  _fullQuote: VizFullQuoteResponse,
): string {
  return PROOF_OF_INSURANCE_EMAIL;
}

export function resolveVizProofOfInsurancePolicyRequestId(
  payment: VizPaymentResponse,
): string {
  const policyRequestId = payment.id;

  if (!policyRequestId) {
    throw new Error('Payment response is missing id');
  }

  return policyRequestId;
}

export function mapVizToProofOfInsuranceEmailPayload(
  fullQuote: VizFullQuoteResponse,
  payment: VizPaymentResponse,
  overrides: Partial<VizProofOfInsuranceEmailPayload> = {},
): VizProofOfInsuranceEmailPayload {
  return {
    email: resolveVizProofOfInsuranceEmail(fullQuote),
    policyRequestId: resolveVizProofOfInsurancePolicyRequestId(payment),
    ...overrides,
  };
}
