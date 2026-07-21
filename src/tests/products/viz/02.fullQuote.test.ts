import {
  buildVizFullQuotePayload,
  buildVizMonthlyFullQuotePayload,
  resolveVizQuickQuoteId,
} from '../../../products/viz/data/fullQuote.payload';
import { defaultVizFullQuoteTemplate } from '../../../products/viz/data/fullQuote.defaults';
import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizFullQuoteResponse } from '../../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Viz Full Quote API', () => {
  it(
    'should create full quote using quoteId mapped from quick quote response',
    async () => {
      const quickQuoteResponse = await createVizQuickQuoteWithRetry(
        buildVizQuickQuotePayload,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;
      const quoteId = resolveVizQuickQuoteId(quickQuote);
      const fullQuotePayload = buildVizFullQuotePayload(quickQuote);

      expect(fullQuotePayload.quoteId).toBe(quoteId);
      expect(fullQuotePayload.metadata.quoteId).toBe(quoteId);
      expect(fullQuotePayload.companyRevenue).toBe(
        defaultVizFullQuoteTemplate.companyRevenue,
      );
      expect(fullQuotePayload.companyName).toBe('TRES ABOGADOS PTY LTD');
      expect(fullQuotePayload.state).toBe('VIC');
      expect(fullQuotePayload.aggregateLimit).toBe(5000000);
      expect(fullQuotePayload.excess).toBe(500);
      expect(fullQuotePayload.tools.include).toBe(true);
      expect(fullQuotePayload.taxAudit.include).toBe(true);
      expect(fullQuotePayload.clientInformation.email).toBe(
        quickQuote.req.clientInformation.email,
      );
      expect(fullQuotePayload.occupations).toEqual(
        defaultVizFullQuoteTemplate.occupations,
      );
      expect(fullQuotePayload.isMonthlySubscription).toBe(false);

      const fullQuoteResponse = await createVizFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;

      expect(fullQuote.fullQuote.id).toBe(quoteId);
      expect(fullQuote.fullQuote.id.startsWith('viz_')).toBe(true);
      expect(fullQuote.fullQuote.priceBreakdown.clientPayable).toBeTruthy();
    },
    300000,
  );

  it(
    'should create monthly full quote using quoteId mapped from quick quote response',
    async () => {
      const quickQuoteResponse = await createVizQuickQuoteWithRetry(
        buildVizQuickQuotePayload,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;
      const quoteId = resolveVizQuickQuoteId(quickQuote);
      const fullQuotePayload = buildVizMonthlyFullQuotePayload(quickQuote);

      expect(fullQuotePayload.quoteId).toBe(quoteId);
      expect(fullQuotePayload.metadata.quoteId).toBe(quoteId);
      expect(fullQuotePayload.isMonthlySubscription).toBe(true);
      expect(fullQuotePayload.clientInformation.email).toBe(
        quickQuote.req.clientInformation.email,
      );
      expect(fullQuotePayload.occupations).toEqual(
        defaultVizFullQuoteTemplate.occupations,
      );

      const fullQuoteResponse = await createVizFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;

      expect(fullQuote.fullQuote.id).toBe(quoteId);
      expect(fullQuote.fullQuote.isMonthlySubscription).toBe(true);
      expect(
        fullQuote.fullQuote.priceBreakdown.monthlyBreakdown?.firstInstallmentPayable,
      ).toBeTruthy();
    },
    300000,
  );
});
