import type { ProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';
import type { PaymentResponse } from '../types/payment.types';

export function resolveProofOfInsuranceEmail(fullQuote: FullQuoteResponse): string {
  const email = fullQuote.fullQuote.req.clientInformation.email;

  if (!email) {
    throw new Error('Full quote response is missing req.clientInformation.email');
  }

  return email;
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
