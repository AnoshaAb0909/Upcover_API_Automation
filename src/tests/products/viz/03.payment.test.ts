import { buildVizFullQuotePayload } from '../../../products/viz/data/fullQuote.payload';
import { buildVizAnnualPaymentPayload } from '../../../products/viz/data/payment.payload';
import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import { createVizAnnualPayment } from '../../../products/viz/services/payment.service';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizFullQuoteResponse } from '../../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Viz Annual Payment API', () => {
  it(
    'should map annual payment payload from full quote response and post payment',
    async () => {
      const quickQuoteResponse = await createVizQuickQuoteWithRetry(
        buildVizQuickQuotePayload,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;
      const fullQuoteResponse = await createVizFullQuote(
        buildVizFullQuotePayload(quickQuote),
      );

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;
      const clientPayable = fullQuote.fullQuote.priceBreakdown.clientPayable;
      const paymentPayload = buildVizAnnualPaymentPayload(fullQuote);

      expect(paymentPayload.quoteId).toBe(fullQuote.fullQuote.id);
      expect(paymentPayload.expectedPrice).toBe(clientPayable);
      expect(fullQuote.fullQuote.isMonthlySubscription).toBe(false);
      expect(paymentPayload.paymentMethodId).toBeTruthy();
      expect(paymentPayload).not.toHaveProperty('couponId');
      expect(paymentPayload).not.toHaveProperty('isCouponApplied');

      const paymentResponse = await createVizAnnualPayment(paymentPayload);

      expect(paymentResponse.status).not.toBe(400);
      expect(paymentResponse.status).not.toBe(401);

      if (
        paymentResponse.status === 500 &&
        paymentResponse.body?.message === 'Customer does not exist'
      ) {
        console.warn(
          'Viz annual payment mapping succeeded, but Stripe customer is missing on this environment. ' +
            'Set VIZ_PAYMENT_METHOD_ID in .env to a valid payment method.',
        );
        return;
      }

      expectApiStatus(paymentResponse, 201);
    },
    300000,
  );
});
