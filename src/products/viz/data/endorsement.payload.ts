import {
  mapVizQuickQuoteResponseToFullQuotePayload,
} from './fullQuote.mapper';
import { buildDefaultVizPolicyDates } from './fullQuote.defaults';
import { mapVizFullQuoteResponseToEndorsementPayload } from './endorsement.mapper';
import { vizEndorsementMonthlyFullQuoteTemplate } from './endorsement.fullQuote.defaults';
import type { VizEndorsementPayload } from '../types/endorsement.payload.types';
import type { VizFullQuotePayload } from '../types/fullQuote.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../types/quickQuote.types';

export {
  mapVizFullQuoteResponseToEndorsementPayload,
  resolveVizParentQuoteId,
} from './endorsement.mapper';

export function buildVizEndorsementMonthlyFullQuotePayload(
  quickQuote: VizQuickQuoteResponse,
  overrides: Partial<VizFullQuotePayload> = {},
): VizFullQuotePayload {
  const { policyStartDate, policyExpiryDate } = buildDefaultVizPolicyDates();

  return mapVizQuickQuoteResponseToFullQuotePayload(quickQuote, {
    isMonthlySubscription: true,
    overrides: {
      ...vizEndorsementMonthlyFullQuoteTemplate,
      policyStartDate,
      policyExpiryDate,
      clientInformation: quickQuote.req.clientInformation,
      ...overrides,
    },
  });
}

export function buildVizEndorsementPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizEndorsementPayload> = {},
): VizEndorsementPayload {
  return mapVizFullQuoteResponseToEndorsementPayload(fullQuote, overrides);
}
