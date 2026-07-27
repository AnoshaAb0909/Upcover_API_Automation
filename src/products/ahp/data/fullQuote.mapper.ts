import { generateDummyClientInformation } from '../../../shared/data/dummyData';
import {
  AHP_OCCUPATION_NAMES_BY_ID,
  AHP_STATE_NAMES_BY_ID,
  buildAhpCompanyName,
  buildDefaultAhpPolicyStartDate,
  defaultAhpFullQuoteTemplate,
} from './fullQuote.defaults';
import type { AhpFullQuotePayload } from '../types/fullQuote.payload.types';
import type { AhpQuickQuotePayload } from '../types/quickQuote.payload.types';
import type { AhpQuickQuoteResponse } from '../types/quickQuote.types';

export function resolveAhpQuickQuoteId(quickQuote: AhpQuickQuoteResponse): string {
  return quickQuote.policyRequestId;
}

function mapOccupations(
  quickQuoteRequest: AhpQuickQuotePayload,
): AhpFullQuotePayload['occupations'] {
  return quickQuoteRequest.occupations.map((occupation) => ({
    occupationId: occupation.id,
    name: AHP_OCCUPATION_NAMES_BY_ID[occupation.id] ?? '',
    percentage: occupation.percentage,
  }));
}

function mapStatesSplit(
  quickQuoteRequest: AhpQuickQuotePayload,
): AhpFullQuotePayload['statesSplit'] {
  return quickQuoteRequest.states.map((state) => ({
    id: state.id,
    percentage: state.percentage,
    name: AHP_STATE_NAMES_BY_ID[state.id] ?? '',
  }));
}

export function mapAhpQuickQuoteToFullQuotePayload(
  quickQuote: AhpQuickQuoteResponse,
  quickQuoteRequest: AhpQuickQuotePayload,
  options: {
    overrides?: Partial<AhpFullQuotePayload>;
    clientInformation?: {
      firstName: string;
      lastName: string;
      email: string;
    };
    isMonthlySubscription?: boolean;
  } = {},
): AhpFullQuotePayload {
  const quoteId = resolveAhpQuickQuoteId(quickQuote);
  const clientInformation =
    options.clientInformation ?? generateDummyClientInformation();
  const companyName = buildAhpCompanyName(
    clientInformation.firstName,
    clientInformation.lastName,
  );
  const overrides = options.overrides ?? {};
  const isMonthlySubscription =
    options.isMonthlySubscription ??
    overrides.isMonthlySubscription ??
    defaultAhpFullQuoteTemplate.isMonthlySubscription;

  const base: AhpFullQuotePayload = {
    ...defaultAhpFullQuoteTemplate,
    quoteId,
    policyStartDate: buildDefaultAhpPolicyStartDate(),
    firstName: clientInformation.firstName,
    lastName: clientInformation.lastName,
    email: clientInformation.email,
    insuredName: companyName,
    companyName,
    occupations: mapOccupations(quickQuoteRequest),
    revenueLastFy: quickQuoteRequest.averageRevenue,
    revenueCurrentFy: quickQuoteRequest.averageRevenue,
    operatesInMultipleStates: quickQuoteRequest.states.length > 1,
    statesSplit: mapStatesSplit(quickQuoteRequest),
    coverInput: quickQuoteRequest.coverInput,
    isMonthlySubscription,
  };

  return mergeAhpFullQuotePayload(base, overrides, quoteId);
}

function mergeAhpFullQuotePayload(
  base: AhpFullQuotePayload,
  overrides: Partial<AhpFullQuotePayload>,
  quoteId: string,
): AhpFullQuotePayload {
  return {
    ...base,
    ...overrides,
    quoteId,
    address: {
      ...base.address,
      ...overrides.address,
    },
    occupations: overrides.occupations ?? base.occupations,
    statesSplit: overrides.statesSplit ?? base.statesSplit,
    declarations: overrides.declarations ?? base.declarations,
    coverInput: overrides.coverInput ?? base.coverInput,
  };
}
