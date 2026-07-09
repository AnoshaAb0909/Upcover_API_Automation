import {
  buildDefaultClientAddress,
  buildDefaultPolicyDates,
  defaultFullQuoteDeclarations,
} from './fullQuote.defaults';
import type { FullQuotePayload } from '../types/fullQuote.payload.types';
import type { QuickQuoteApplicationResponses } from '../types/quickQuote.response.types';
import type { QuickQuoteResponse } from '../types/quickQuote.types';

export function resolveQuickQuoteId(quickQuote: QuickQuoteResponse): string {
  return quickQuote.id;
}

function buildClientAddress(
  companyAddress: FullQuotePayload['companyAddress'],
): FullQuotePayload['clientInformation']['address'] {
  return buildDefaultClientAddress(companyAddress);
}

function mapDeclarations(
  applicationResponses: QuickQuoteApplicationResponses,
): FullQuotePayload['declarations'] {
  return {
    piiPhi: applicationResponses.piiPhi,
    backupAndRestore: applicationResponses.backupAndRestore,
    mfaEmail: applicationResponses.mfaEmail,
    mfaRemoteAccess: applicationResponses.mfaRemoteAccess,
    mfaOtherPrivilegedAccounts: applicationResponses.mfaOtherPrivilegedAccounts,
    dualControl5k: applicationResponses.dualControl,
    awareOfPriorClaims: 'No',
    awareOfNewClaims: applicationResponses.awareOfNewClaims,
    engagedIndustries: [],
    encryptsData: applicationResponses.encryptsData,
    contentComplaints: applicationResponses.contentComplaints,
    hasDomains: applicationResponses.hasDomains,
    reviewsContent: applicationResponses.reviewsContent,
    priorClaims: applicationResponses.priorClaims,
    revenueAuActPercentage: applicationResponses.revenueAuActPercentage,
    revenueAuNswPercentage: applicationResponses.revenueAuNswPercentage,
    revenueAuNtPercentage: applicationResponses.revenueAuNtPercentage,
    revenueAuOverseasPercentage: applicationResponses.revenueAuOverseasPercentage,
    revenueAuQldPercentage: applicationResponses.revenueAuQldPercentage,
    revenueAuSaPercentage: applicationResponses.revenueAuSaPercentage,
    revenueAuTasPercentage: applicationResponses.revenueAuTasPercentage,
    revenueAuVicPercentage: applicationResponses.revenueAuVicPercentage,
    revenueAuWaPercentage: applicationResponses.revenueAuWaPercentage,
  };
}

/**
 * Maps a Coalition quick quote response into a full quote request body.
 * Most fields come from quickQuote.req and quickQuote.res.
 */
export function mapQuickQuoteResponseToFullQuotePayload(
  quickQuote: QuickQuoteResponse,
  options: {
    overrides?: Partial<FullQuotePayload>;
    isMonthlySubscription?: boolean;
  } = {},
): FullQuotePayload {
  const quoteId = quickQuote.id;
  const { req, res } = quickQuote;
  const companyAddress = req.companyAddress;
  const { policyStartDate, policyExpiryDate } = buildDefaultPolicyDates();
  const overrides = options.overrides ?? {};
  const isMonthlySubscription =
    options.isMonthlySubscription ??
    overrides.isMonthlySubscription ??
    false;

  const base: FullQuotePayload = {
    quoteId,
    companyIndustry: req.companyIndustry,
    bundle: res.bundle ?? req.bundle,
    companyRevenue: req.companyRevenue,
    companyName: req.companyName,
    companyAddress,
    abnDetails: req.abnDetails,
    clientInformation: {
      ...req.clientInformation,
      address: buildClientAddress(companyAddress),
    },
    declarations: res.applicationResponses
      ? mapDeclarations(res.applicationResponses)
      : defaultFullQuoteDeclarations,
    employeeCount: res.employeeCount ?? 56,
    companyGrossProfitNetRevenue: req.companyRevenue,
    aggregateLimit: res.aggregateLimit ?? req.aggregateLimit,
    defaultRetention: res.defaultRetention ?? 1000,
    policyStartDate,
    policyExpiryDate,
    isMonthlySubscription,
    domainNames: res.domainNames ?? [],
    occupation: req.occupation,
    metadata: {
      quoteId,
    },
  };

  return mergeFullQuotePayload(base, overrides, quoteId);
}

function mergeFullQuotePayload(
  base: FullQuotePayload,
  overrides: Partial<FullQuotePayload>,
  quoteId: string,
): FullQuotePayload {
  return {
    ...base,
    ...overrides,
    quoteId,
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
      address: {
        ...base.clientInformation.address,
        ...overrides.clientInformation?.address,
        viewPort: {
          ...base.clientInformation.address.viewPort,
          ...overrides.clientInformation?.address?.viewPort,
          northEast: {
            ...base.clientInformation.address.viewPort.northEast,
            ...overrides.clientInformation?.address?.viewPort?.northEast,
          },
          southWest: {
            ...base.clientInformation.address.viewPort.southWest,
            ...overrides.clientInformation?.address?.viewPort?.southWest,
          },
        },
      },
    },
    declarations: {
      ...base.declarations,
      ...overrides.declarations,
    },
    companyIndustry: {
      ...base.companyIndustry,
      ...overrides.companyIndustry,
    },
    metadata: {
      ...base.metadata,
      ...overrides.metadata,
      quoteId,
    },
  };
}
