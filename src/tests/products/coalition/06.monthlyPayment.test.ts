import { buildMonthlyFullQuotePayload } from '../../../products/coalition/data/fullQuote.payload';
import { buildMonthlyPaymentPayloadFromFullQuote } from '../../../products/coalition/data/payment.payload';
import { buildQuickQuotePayload } from '../../../products/coalition/data/quickQuote.payload';
import { createFullQuote } from '../../../products/coalition/services/fullQuote.service';
import { createMonthlyPayment } from '../../../products/coalition/services/payment.service';
import { createQuickQuoteWithRetry } from '../../../products/coalition/services/quickQuote.service';
import type { FullQuoteResponse } from '../../../products/coalition/types/fullQuote.types';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Coalition Monthly Payment API', () => {
  it(
    'should run fresh quick quote and monthly full quote, then post monthly payment',
    async () => {
      const quickQuoteResponse = await createQuickQuoteWithRetry(buildQuickQuotePayload);

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as QuickQuoteResponse;
      const fullQuotePayload = buildMonthlyFullQuotePayload(quickQuote);

      expect(fullQuotePayload.isMonthlySubscription).toBe(true);
      expect(fullQuotePayload.quoteId).toBe(quickQuote.id);

      const fullQuoteResponse = await createFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as FullQuoteResponse;
      const firstInstallmentPayable =
        fullQuote.fullQuote.monthlyPriceBreakdown.monthlyBreakdown
          ?.firstInstallmentPayable;
      const paymentPayload = await buildMonthlyPaymentPayloadFromFullQuote(fullQuote);

      expect(paymentPayload.quoteId).toBe(fullQuote.fullQuote.id);
      expect(paymentPayload.expectedPrice).toBe(firstInstallmentPayable);
      expect(paymentPayload.paymentMethodId).toMatch(/^pm_/);
      expect(fullQuote.fullQuote.isMonthlySubscription).toBe(true);
      expect(paymentPayload).not.toHaveProperty('couponId');
      expect(paymentPayload).not.toHaveProperty('isCouponApplied');

      const paymentResponse = await createMonthlyPayment(paymentPayload);

      expect(paymentResponse.status).not.toBe(400);
      expect(paymentResponse.status).not.toBe(401);

      if (
        (paymentResponse.status === 500 || paymentResponse.status === 404) &&
        (paymentResponse.body?.message === 'Customer does not exist' ||
          paymentResponse.body?.message === 'Unknown Stripe error')
      ) {
        console.warn(
          'Coalition monthly payment mapping succeeded, but Stripe is unavailable on this environment. ' +
            'Ensure the client email exists in Stripe or set STRIPE_SECRET_KEY_MONTHLY / FALLBACK_MONTHLY_PAYMENT_METHOD_ID.',
        );
        return;
      }

      expectApiStatus(paymentResponse, 201);
    },
    300000,
  );
});
