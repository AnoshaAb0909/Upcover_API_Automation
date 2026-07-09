import { mapVizToProofOfInsuranceEmailPayload } from './proofOfInsuranceEmail.mapper';
import type { VizProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';
import type { VizPaymentResponse } from '../types/payment.types';

export {
  mapVizToProofOfInsuranceEmailPayload,
  resolveVizProofOfInsuranceEmail,
  resolveVizProofOfInsurancePolicyRequestId,
} from './proofOfInsuranceEmail.mapper';

export function buildVizProofOfInsuranceEmailPayload(
  fullQuote: VizFullQuoteResponse,
  payment: VizPaymentResponse,
  overrides: Partial<VizProofOfInsuranceEmailPayload> = {},
): VizProofOfInsuranceEmailPayload {
  return mapVizToProofOfInsuranceEmailPayload(fullQuote, payment, overrides);
}
