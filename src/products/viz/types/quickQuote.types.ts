import type { VizQuickQuotePayload } from './quickQuote.payload.types';

export type { VizQuickQuotePayload, VizClientInformation, VizOccupationInput } from './quickQuote.payload.types';

export interface VizQuickQuoteResponse {
  id: string;
  type: string;
  partnerId: string;
  req: VizQuickQuotePayload;
  res: Record<string, unknown>;
  priceBreakdown: Record<string, unknown>;
  requestType: string;
  createdAt: string;
}
