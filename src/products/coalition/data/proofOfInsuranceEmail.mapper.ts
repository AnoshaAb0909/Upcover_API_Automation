import type { ProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';
import type { PaymentResponse } from '../types/payment.types';
import { COALITION_NOTIFICATION_EMAIL } from './coalitionNotificationEmail';

export const PROOF_OF_INSURANCE_EMAIL = COALITION_NOTIFICATION_EMAIL;

export function resolveProofOfInsuranceEmail(_fullQuote: FullQuoteResponse): string {
  return PROOF_OF_INSURANCE_EMAIL;
}

export function resolveProofOfInsurancePolicyRequestId(
  payment: PaymentResponse,
): string {
  const policyRequestId = payment.id;

  if (!policyRequestId) {
    throw new Error('Payment response is missing id');
  }

  return policyRequestId;
}

export function mapToProofOfInsuranceEmailPayload(
  fullQuote: FullQuoteResponse,
  payment: PaymentResponse,
  overrides: Partial<ProofOfInsuranceEmailPayload> = {},
): ProofOfInsuranceEmailPayload {
  return {
    email: resolveProofOfInsuranceEmail(fullQuote),
    policyRequestId: resolveProofOfInsurancePolicyRequestId(payment),
    ...overrides,
  };
}
