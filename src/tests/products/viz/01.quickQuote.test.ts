import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Viz Quick Quote API', () => {
  it(
    'should return 201 and include viz id in the response',
    async () => {
      let payload = buildVizQuickQuotePayload();
      const response = await createVizQuickQuoteWithRetry(() => {
        payload = buildVizQuickQuotePayload();
        return payload;
      });

      expectApiStatus(response, 201);

      const data = response.body as VizQuickQuoteResponse;

      expect(data.id).toBeTruthy();
      expect(typeof data.id).toBe('string');
      expect(data.id.startsWith('viz_')).toBe(true);
      expect(data.partnerId).toBe('upcover');
      expect(data.req.companyRevenue).toBe(payload.companyRevenue);
      expect(data.req.state).toBe(payload.state);
      expect(data.req.aggregateLimit).toBe(payload.aggregateLimit);
      expect(data.req.excess).toBe(payload.excess);
      expect(data.req.clientInformation.email).toBe(payload.clientInformation.email);
    },
    300000,
  );
});
