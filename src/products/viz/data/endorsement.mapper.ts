import {
  vizEndorsementAdditionalOccupation,
  vizEndorsementTaxAuditTemplate,
  vizEndorsementToolsTemplate,
} from './endorsement.defaults';
import type {
  VizEndorsementOccupation,
  VizEndorsementPayload,
} from '../types/endorsement.payload.types';
import type { VizFullQuoteResponse } from '../types/fullQuote.types';
import { resolveVizFullQuoteId } from './payment.mapper';

function toIsoDateOnly(value: string): string {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value "${value}" — expected YYYY-MM-DD or ISO datetime`);
  }

  return parsed.toISOString().slice(0, 10);
}

export function resolveVizParentQuoteId(fullQuote: VizFullQuoteResponse): string {
  return resolveVizFullQuoteId(fullQuote);
}

function buildEndorsementOccupations(
  reqOccupations: VizEndorsementOccupation[],
): VizEndorsementOccupation[] {
  const additionalOccupationId = vizEndorsementAdditionalOccupation.occupationId;
  const hasAdditionalOccupation = reqOccupations.some(
    (occupation) => occupation.occupationId === additionalOccupationId,
  );

  if (hasAdditionalOccupation) {
    return reqOccupations;
  }

  return [...reqOccupations, vizEndorsementAdditionalOccupation];
}

export function mapVizFullQuoteResponseToEndorsementPayload(
  fullQuote: VizFullQuoteResponse,
  overrides: Partial<VizEndorsementPayload> = {},
): VizEndorsementPayload {
  const parentQuoteId = resolveVizParentQuoteId(fullQuote);
  const req = fullQuote.fullQuote.req;
  const policyStartDate = toIsoDateOnly(req.policyStartDate);
  const policyExpiryDate = toIsoDateOnly(req.policyExpiryDate);

  const base: VizEndorsementPayload = {
    parentQuoteId,
    companyRevenue: req.companyRevenue,
    companyName: req.companyName,
    companyAddress: req.companyAddress,
    abnDetails: req.abnDetails,
    nswSdExempt: req.nswSdExempt,
    subContractorServiceEngagement: req.subContractorServiceEngagement,
    hasBusinessDeclarationIssues: req.hasBusinessDeclarationIssues,
    state: req.state,
    clientInformation: req.clientInformation,
    aggregateLimit: req.aggregateLimit,
    excess: req.excess,
    isCouponApplied: false,
    policyStartDate,
    policyExpiryDate,
    endorsementEffectiveDate: policyStartDate,
    occupations: buildEndorsementOccupations(req.occupations),
    isMonthlySubscription:
      req.isMonthlySubscription ?? fullQuote.fullQuote.isMonthlySubscription ?? false,
    tools: vizEndorsementToolsTemplate,
    taxAudit: vizEndorsementTaxAuditTemplate,
    metadata: {
      flow: 'endorsement',
      quoteId: parentQuoteId,
    },
  };

  return mergeVizEndorsementPayload(base, overrides, parentQuoteId);
}

function mergeVizEndorsementPayload(
  base: VizEndorsementPayload,
  overrides: Partial<VizEndorsementPayload>,
  parentQuoteId: string,
): VizEndorsementPayload {
  return {
    ...base,
    ...overrides,
    parentQuoteId,
    companyAddress: {
      ...base.companyAddress,
      ...overrides.companyAddress,
      viewPort: {
        ...base.companyAddress.viewPort,
        ...overrides.companyAddress?.viewPort,
        northEast: {
          ...base.companyAddress.viewPort.northEast,
          ...overrides.companyAddress?.viewPort?.northEast,
        },
        southWest: {
          ...base.companyAddress.viewPort.southWest,
          ...overrides.companyAddress?.viewPort?.southWest,
        },
      },
    },
    abnDetails: {
      ...base.abnDetails,
      ...overrides.abnDetails,
    },
    clientInformation: {
      ...base.clientInformation,
      ...overrides.clientInformation,
    },
    occupations: overrides.occupations ?? base.occupations,
    tools: {
      ...base.tools,
      ...overrides.tools,
      items: overrides.tools?.items ?? base.tools.items,
    },
    taxAudit: {
      ...base.taxAudit,
      ...overrides.taxAudit,
    },
    metadata: {
      ...base.metadata,
      ...overrides.metadata,
      quoteId: parentQuoteId,
    },
  };
}
