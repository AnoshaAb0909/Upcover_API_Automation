import { buildAnnualFullQuoteOverrides } from './annualFullQuote.template';
import { mapQuickQuoteResponseToFullQuotePayload } from './fullQuote.mapper';
import type { FullQuotePayload } from '../types/fullQuote.payload.types';
import type { QuickQuoteResponse } from '../types/quickQuote.types';

export {
  mapQuickQuoteResponseToFullQuotePayload,
  resolveQuickQuoteId,
} from './fullQuote.mapper';

export function buildFullQuotePayload(
  quickQuote: QuickQuoteResponse,
  options: {
    overrides?: Partial<FullQuotePayload>;
    isMonthlySubscription?: boolean;
  } = {},
): FullQuotePayload {
  return mapQuickQuoteResponseToFullQuotePayload(quickQuote, options);
}

export function buildMonthlyFullQuotePayload(
  quickQuote: QuickQuoteResponse,
  overrides: Partial<FullQuotePayload> = {},
): FullQuotePayload {
  return mapQuickQuoteResponseToFullQuotePayload(quickQuote, {
    isMonthlySubscription: true,
    overrides,
  });
}

export function buildAnnualFullQuotePayload(
  quickQuote: QuickQuoteResponse,
  overrides: Partial<FullQuotePayload> = {},
): FullQuotePayload {
  const annualOverrides = buildAnnualFullQuoteOverrides(quickQuote);

  return mapQuickQuoteResponseToFullQuotePayload(quickQuote, {
    isMonthlySubscription: false,
    overrides: {
      ...annualOverrides,
      ...overrides,
      clientInformation: {
        ...annualOverrides.clientInformation,
        ...overrides.clientInformation,
        address: {
          ...annualOverrides.clientInformation?.address,
          ...overrides.clientInformation?.address,
        },
      },
      declarations: {
        ...annualOverrides.declarations,
        ...overrides.declarations,
      },
      metadata: {
        ...annualOverrides.metadata,
        ...overrides.metadata,
      },
    },
  });
}
