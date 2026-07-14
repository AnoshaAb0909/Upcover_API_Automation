import {
  buildMonthlyFullQuotePayload,
  resolveQuickQuoteId,
} from '../../../products/coalition/data/fullQuote.payload';
import { buildQuickQuotePayload } from '../../../products/coalition/data/quickQuote.payload';
import { createFullQuote } from '../../../products/coalition/services/fullQuote.service';
import { createQuickQuoteWithRetry } from '../../../products/coalition/services/quickQuote.service';
import type { FullQuoteResponse } from '../../../products/coalition/types/fullQuote.types';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Coalition Monthly Full Quote API', () => {
  it(
    'should create monthly full quote using quoteId mapped from quick quote response',
    async () => {
      let quickQuoteRequest = buildQuickQuotePayload();
      const quickQuoteResponse = await createQuickQuoteWithRetry(() => {
        quickQuoteRequest = buildQuickQuotePayload();
        return quickQuoteRequest;
      });

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as QuickQuoteResponse;
      const quoteId = resolveQuickQuoteId(quickQuote);
      expect(quoteId).toBeTruthy();

      const fullQuotePayload = buildMonthlyFullQuotePayload(quickQuote);

      expect(fullQuotePayload.quoteId).toBe(quoteId);
      expect(fullQuotePayload.metadata.quoteId).toBe(quoteId);
      expect(fullQuotePayload.isMonthlySubscription).toBe(true);
      expect(fullQuotePayload.companyRevenue).toBe(quickQuoteRequest.companyRevenue);
      expect(fullQuotePayload.companyName).toBe(quickQuoteRequest.companyName);
      expect(fullQuotePayload.aggregateLimit).toBe(quickQuoteRequest.aggregateLimit);

      const fullQuoteResponse = await createFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as FullQuoteResponse;
      expect(fullQuote.fullQuote).toHaveProperty('id');
      expect(fullQuote.fullQuote.id).toBeTruthy();
      expect(typeof fullQuote.fullQuote.id).toBe('string');
      expect(fullQuote.fullQuote.isMonthlySubscription).toBe(true);
      expect(
        fullQuote.fullQuote.monthlyPriceBreakdown.monthlyBreakdown?.firstInstallmentPayable,
      ).toBeTruthy();
    },
    240000,
  );
});
