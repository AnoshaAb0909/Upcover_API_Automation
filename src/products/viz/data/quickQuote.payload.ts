import { generateDummyClientInformation } from '../../../shared/data/dummyData';
import {
  DEFAULT_VIZ_PHONE_NUMBER,
  defaultVizQuickQuotePayload,
} from './quickQuote.defaults';
import type { VizQuickQuotePayload } from '../types/quickQuote.payload.types';

export function buildVizQuickQuotePayload(
  overrides: Partial<VizQuickQuotePayload> = {},
): VizQuickQuotePayload {
  const dummyClient = generateDummyClientInformation();

  return {
    ...defaultVizQuickQuotePayload,
    ...overrides,
    clientInformation: {
      firstName: dummyClient.firstName,
      lastName: dummyClient.lastName,
      email: dummyClient.email,
      phoneNumber: DEFAULT_VIZ_PHONE_NUMBER,
      ...overrides.clientInformation,
    },
    occupations: overrides.occupations ?? defaultVizQuickQuotePayload.occupations,
  };
}
