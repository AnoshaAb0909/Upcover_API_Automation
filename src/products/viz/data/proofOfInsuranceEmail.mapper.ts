import type { VizProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';
import { VIZ_NOTIFICATION_EMAIL } from './vizNotificationEmail';

export const PROOF_OF_INSURANCE_EMAIL = VIZ_NOTIFICATION_EMAIL;

export function resolveVizProofOfInsuranceEmail(
  _fullQuote: VizFullQuoteResponse,
): string {
  return PROOF_OF_INSURANCE_EMAIL;
}

export function resolveVizProofOfInsurancePolicyRequestId(
  fullQuote: VizFullQuoteResponse,
): string {
  const policyRequestId = fullQuote.fullQuote.id;

  if (!policyRequestId) {
    throw new Error('Full quote response is missing id');
  }

  return policyRequestId;
}

export function mapVizToProofOfInsuranceEmailPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizProofOfInsuranceEmailPayload> = {},
): VizProofOfInsuranceEmailPayload {
  return {
    email: resolveVizProofOfInsuranceEmail(fullQuote),
    policyRequestId: resolveVizProofOfInsurancePolicyRequestId(fullQuote),
    ...overrides,
  };
}
