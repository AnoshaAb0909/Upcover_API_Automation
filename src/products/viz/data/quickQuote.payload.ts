import {
  defaultVizQuickQuotePayload,
} from './quickQuote.defaults';
import type { VizQuickQuotePayload } from '../types/quickQuote.payload.types';

export function buildVizQuickQuotePayload(
  overrides: Partial<VizQuickQuotePayload> = {},
): VizQuickQuotePayload {
  return {
    ...defaultVizQuickQuotePayload,
    ...overrides,
    occupations: overrides.occupations ?? defaultVizQuickQuotePayload.occupations,
    declarations: overrides.declarations ?? defaultVizQuickQuotePayload.declarations,
  };
}

export function buildVizMonthlyQuickQuotePayload(
  overrides: Partial<VizQuickQuotePayload> = {},
): VizQuickQuotePayload {
  return buildVizQuickQuotePayload({
    ...overrides,
    isMonthlySubscription: true,
  });
}
