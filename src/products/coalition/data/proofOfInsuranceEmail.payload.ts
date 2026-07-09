import { mapToProofOfInsuranceEmailPayload } from './proofOfInsuranceEmail.mapper';
import type { ProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { FullQuoteResponse } from '../types/fullQuote.types';
import type { PaymentResponse } from '../types/payment.types';

export {
  mapToProofOfInsuranceEmailPayload,
  resolveProofOfInsuranceEmail,
  resolveProofOfInsurancePolicyRequestId,
} from './proofOfInsuranceEmail.mapper';

export function buildProofOfInsuranceEmailPayload(
  fullQuote: FullQuoteResponse,
  payment: PaymentResponse,
  overrides: Partial<ProofOfInsuranceEmailPayload> = {},
): ProofOfInsuranceEmailPayload {
  return mapToProofOfInsuranceEmailPayload(fullQuote, payment, overrides);
}
