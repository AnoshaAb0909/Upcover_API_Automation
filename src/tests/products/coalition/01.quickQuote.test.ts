import { buildQuickQuotePayload } from '../../../products/coalition/data/quickQuote.payload';
import { createQuickQuoteWithRetry } from '../../../products/coalition/services/quickQuote.service';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Coalition Quick Quote API', () => {
  it('should return 201 and include id in the response', async () => {
    let payload = buildQuickQuotePayload();
    const response = await createQuickQuoteWithRetry(() => {
      payload = buildQuickQuotePayload();
      return payload;
    });

    expectApiStatus(response, 201);

    const data = response.body as QuickQuoteResponse;

    expect(data.id).toBeTruthy();
    expect(typeof data.id).toBe('string');
    expect(data.id.startsWith('col_')).toBe(true);
    expect(data.req.companyName).toBe(payload.companyName);
    expect(data.req.companyRevenue).toBe(payload.companyRevenue);
  });
});
