import {
  buildAhpFullQuotePayload,
  resolveAhpQuickQuoteId,
} from '../../../products/ahp/data/fullQuote.payload';
import { buildAhpQuickQuotePayload } from '../../../products/ahp/data/quickQuote.payload';
import { createAhpFullQuote } from '../../../products/ahp/services/fullQuote.service';
import { createAhpQuickQuoteWithRetry } from '../../../products/ahp/services/quickQuote.service';
import type { AhpFullQuoteResponseBody } from '../../../products/ahp/types/fullQuote.types';
import type { AhpQuickQuoteResponse } from '../../../products/ahp/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('AHP Full Quote API', () => {
  it(
    'should create full quote using quoteId and QQ fields mapped from quick quote',
    async () => {
      const quickQuoteRequest = buildAhpQuickQuotePayload();
      const quickQuoteResponse = await createAhpQuickQuoteWithRetry(
        () => quickQuoteRequest,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as AhpQuickQuoteResponse;
      const quoteId = resolveAhpQuickQuoteId(quickQuote);
      const fullQuotePayload = buildAhpFullQuotePayload(
        quickQuote,
        quickQuoteRequest,
      );

      expect(fullQuotePayload.quoteId).toBe(quoteId);
      expect(fullQuotePayload.revenueLastFy).toBe(quickQuoteRequest.averageRevenue);
      expect(fullQuotePayload.revenueCurrentFy).toBe(quickQuoteRequest.averageRevenue);
      expect(fullQuotePayload.coverInput).toEqual(quickQuoteRequest.coverInput);
      expect(fullQuotePayload.occupations).toEqual([
        {
          occupationId: quickQuoteRequest.occupations[0].id,
          name: 'Light/Heat Therapy',
          percentage: quickQuoteRequest.occupations[0].percentage,
        },
      ]);
      expect(fullQuotePayload.statesSplit).toEqual([
        {
          id: quickQuoteRequest.states[0].id,
          name: 'NSW',
          percentage: quickQuoteRequest.states[0].percentage,
        },
      ]);
      expect(fullQuotePayload.email).toContain('@upcover.com');
      expect(fullQuotePayload.firstName).toBeTruthy();
      expect(fullQuotePayload.lastName).toBeTruthy();
      expect(fullQuotePayload.insuredName).toBe(fullQuotePayload.companyName);
      expect(fullQuotePayload.companyName).toContain('PTY LTD');
      expect(fullQuotePayload.isMonthlySubscription).toBe(false);

      const fullQuoteResponse = await createAhpFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as AhpFullQuoteResponseBody;

      expect(fullQuote.quote.policyRequestId).toBe(quoteId);
      expect(fullQuote.quote.referenceNumber).toBeTruthy();
      expect(fullQuote.quote.totalPremium.length).toBeGreaterThan(0);
    },
    300000,
  );
});
