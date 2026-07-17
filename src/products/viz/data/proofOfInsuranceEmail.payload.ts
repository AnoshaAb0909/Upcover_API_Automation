import { mapVizToProofOfInsuranceEmailPayload } from './proofOfInsuranceEmail.mapper';
import type { VizProofOfInsuranceEmailPayload } from '../types/proofOfInsuranceEmail.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';

export {
  mapVizToProofOfInsuranceEmailPayload,
  resolveVizProofOfInsuranceEmail,
  resolveVizProofOfInsurancePolicyRequestId,
} from './proofOfInsuranceEmail.mapper';

export function buildVizProofOfInsuranceEmailPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizProofOfInsuranceEmailPayload> = {},
): VizProofOfInsuranceEmailPayload {
  return mapVizToProofOfInsuranceEmailPayload(fullQuote, overrides);
}
