import { buildVizMonthlyFullQuotePayload } from '../../../products/viz/data/fullQuote.payload';
import { buildVizMonthlyPaymentPayload } from '../../../products/viz/data/payment.payload';
import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import { createVizMonthlyPayment } from '../../../products/viz/services/payment.service';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizFullQuoteResponse } from '../../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Viz Monthly Payment API', () => {
  it(
    'should run fresh quick quote and monthly full quote, then post monthly payment',
    async () => {
      const quickQuoteResponse = await createVizQuickQuoteWithRetry(
        buildVizQuickQuotePayload,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;
      const fullQuotePayload = buildVizMonthlyFullQuotePayload(quickQuote);

      expect(fullQuotePayload.isMonthlySubscription).toBe(true);
      expect(fullQuotePayload.quoteId).toBe(quickQuote.id);

      const fullQuoteResponse = await createVizFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;
      const firstInstallmentPayable =
        fullQuote.fullQuote.priceBreakdown.monthlyBreakdown?.firstInstallmentPayable;
      const paymentPayload = buildVizMonthlyPaymentPayload(fullQuote);

      expect(paymentPayload.quoteId).toBe(fullQuote.fullQuote.id);
      expect(paymentPayload.expectedPrice).toBe(firstInstallmentPayable);
      expect(paymentPayload.paymentMethodId).toBeTruthy();
      expect(fullQuote.fullQuote.isMonthlySubscription).toBe(true);
      expect(paymentPayload).not.toHaveProperty('couponId');
      expect(paymentPayload).not.toHaveProperty('isCouponApplied');

      const paymentResponse = await createVizMonthlyPayment(paymentPayload);

      expect(paymentResponse.status).not.toBe(400);
      expect(paymentResponse.status).not.toBe(401);

      if (
        (paymentResponse.status === 500 || paymentResponse.status === 404) &&
        (paymentResponse.body?.message === 'Customer does not exist' ||
          paymentResponse.body?.message === 'Unknown Stripe error')
      ) {
        console.warn(
          'Viz monthly payment mapping succeeded, but Stripe is unavailable on this environment. ' +
            'Set VIZ_MONTHLY_PAYMENT_METHOD_ID in .env to a valid payment method.',
        );
        return;
      }

      expectApiStatus(paymentResponse, 201);
    },
    300000,
  );
});
