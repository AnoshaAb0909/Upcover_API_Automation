import { defaultAhpQuickQuotePayload } from './quickQuote.defaults';
import type { AhpQuickQuotePayload } from '../types/quickQuote.payload.types';

export { defaultAhpQuickQuotePayload };

export function buildAhpQuickQuotePayload(
  overrides: Partial<AhpQuickQuotePayload> = {},
): AhpQuickQuotePayload {
  return {
    ...defaultAhpQuickQuotePayload,
    ...overrides,
    occupations: overrides.occupations ?? defaultAhpQuickQuotePayload.occupations,
    states: overrides.states ?? defaultAhpQuickQuotePayload.states,
    coverInput: overrides.coverInput ?? defaultAhpQuickQuotePayload.coverInput,
  };
}
