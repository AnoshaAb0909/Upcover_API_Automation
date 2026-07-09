import type { VizProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';
import type { VizPaymentResponse } from '../types/payment.types';

export function resolveVizProofOfInsuranceEmail(
  fullQuote: VizFullQuoteResponse,
): string {
  const email = fullQuote.fullQuote.req.clientInformation.email;

  if (!email) {
    throw new Error('Full quote response is missing req.clientInformation.email');
  }

  return email;
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
