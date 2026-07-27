import { buildAhpQuickQuotePayload } from '../../../products/ahp/data/quickQuote.payload';
import { createAhpQuickQuoteWithRetry } from '../../../products/ahp/services/quickQuote.service';
import type { AhpQuickQuoteResponse } from '../../../products/ahp/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('AHP Quick Quote API', () => {
  it(
    'should return 201 and include policyRequestId in the response',
    async () => {
      const payload = buildAhpQuickQuotePayload();
      const response = await createAhpQuickQuoteWithRetry(() => payload);

      expectApiStatus(response, 201);

      const data = response.body as AhpQuickQuoteResponse;

      expect(data.policyRequestId).toBeTruthy();
      expect(typeof data.policyRequestId).toBe('string');
      expect(data.referenceNumber).toBeTruthy();
      expect(data.totalPremium.length).toBeGreaterThan(0);
      expect(data.totalPremium[0].coverId).toBe(payload.coverInput[0].coverId);
      expect(data.totalPremium[0].premium.clientPayable).toBeGreaterThan(0);
      expect(data.coverInputs[0].id).toBe(payload.coverInput[0].coverId);
      expect(data.referralDeclineReasons).toEqual([]);
    },
    300000,
  );
});
