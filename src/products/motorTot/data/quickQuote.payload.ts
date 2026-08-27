import { generateMotorTotClientId } from '../helpers/generateMotorTotClientId';
import { defaultMotorTotQuickQuotePayload } from './quickQuote.defaults';
import type { MotorTotQuickQuotePayload } from '../types/quickQuote.payload.types';

export function buildMotorTotQuickQuotePayload(
  overrides: Partial<MotorTotQuickQuotePayload> = {},
): MotorTotQuickQuotePayload {
  return {
    ...defaultMotorTotQuickQuotePayload,
    ...overrides,
    clientId: overrides.clientId ?? generateMotorTotClientId(),
    clientInformation: {
      ...defaultMotorTotQuickQuotePayload.clientInformation,
      ...overrides.clientInformation,
      businessAddress: {
        address: {
          ...defaultMotorTotQuickQuotePayload.clientInformation.businessAddress
            .address,
          ...overrides.clientInformation?.businessAddress?.address,
        },
      },
    },
    vehicles: overrides.vehicles ?? defaultMotorTotQuickQuotePayload.vehicles,
  };
}
