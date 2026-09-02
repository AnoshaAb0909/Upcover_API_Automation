import { generateDummyClientInformation } from '../../../shared/data/dummyData';
import {
  buildDefaultVizPolicyDates,
  defaultVizFullQuoteTemplate,
} from './fullQuote.defaults';
import { DEFAULT_VIZ_PHONE_NUMBER } from './quickQuote.defaults';
import type { VizFullQuotePayload } from '../types/fullQuote.payload.types';
import type { VizClientInformation } from '../types/quickQuote.payload.types';
import type { VizQuickQuoteResponse } from '../types/quickQuote.types';

function buildVizFullQuoteClientInformation(): VizClientInformation {
  const dummyClient = generateDummyClientInformation();

  return {
    firstName: dummyClient.firstName,
    lastName: dummyClient.lastName,
    email: dummyClient.email,
    phoneNumber: DEFAULT_VIZ_PHONE_NUMBER,
  };
}

export function resolveVizQuickQuoteId(quickQuote: VizQuickQuoteResponse): string {
  return quickQuote.id;
}

export function mapVizQuickQuoteResponseToFullQuotePayload(
  quickQuote: VizQuickQuoteResponse,
  options: {
    overrides?: Partial<VizFullQuotePayload>;
    isMonthlySubscription?: boolean;
  } = {},
): VizFullQuotePayload {
  const quoteId = resolveVizQuickQuoteId(quickQuote);
  const { policyStartDate, policyExpiryDate } = buildDefaultVizPolicyDates();
  const overrides = options.overrides ?? {};
  const isMonthlySubscription =
    options.isMonthlySubscription ??
    overrides.isMonthlySubscription ??
    defaultVizFullQuoteTemplate.isMonthlySubscription;

  const base: VizFullQuotePayload = {
    quoteId,
    ...defaultVizFullQuoteTemplate,
    policyStartDate,
    policyExpiryDate,
    isMonthlySubscription,
    clientInformation: buildVizFullQuoteClientInformation(),
    occupations: quickQuote.req.occupations ?? defaultVizFullQuoteTemplate.occupations,
    declarations:
      quickQuote.req.declarations ?? defaultVizFullQuoteTemplate.declarations,
    metadata: {
      quoteId,
    },
  };

  return mergeVizFullQuotePayload(base, overrides, quoteId);
}

function mergeVizFullQuotePayload(
  base: VizFullQuotePayload,
  overrides: Partial<VizFullQuotePayload>,
  quoteId: string,
): VizFullQuotePayload {
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
    },
    occupations: overrides.occupations ?? base.occupations,
    declarations: overrides.declarations ?? base.declarations,
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
      quoteId,
    },
  };
}
