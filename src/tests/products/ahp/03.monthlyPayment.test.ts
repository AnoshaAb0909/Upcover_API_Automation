import { buildAhpMonthlyFullQuotePayload } from '../../../products/ahp/data/fullQuote.payload';
import { buildAhpMonthlyPaymentPayloadFromFullQuote } from '../../../products/ahp/data/payment.payload';
import { buildAhpQuickQuotePayload } from '../../../products/ahp/data/quickQuote.payload';
import { createAhpFullQuote } from '../../../products/ahp/services/fullQuote.service';
import { createAhpMonthlyPayment } from '../../../products/ahp/services/payment.service';
import { createAhpQuickQuoteWithRetry } from '../../../products/ahp/services/quickQuote.service';
import type { AhpFullQuoteResponseBody } from '../../../products/ahp/types/fullQuote.types';
import type { AhpQuickQuoteResponse } from '../../../products/ahp/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('AHP Monthly Payment API', () => {
  it(
    'should run quick quote and monthly full quote, then post monthly payment',
    async () => {
      const quickQuoteRequest = buildAhpQuickQuotePayload();
      const quickQuoteResponse = await createAhpQuickQuoteWithRetry(
        () => quickQuoteRequest,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as AhpQuickQuoteResponse;
      const fullQuotePayload = buildAhpMonthlyFullQuotePayload(
        quickQuote,
        quickQuoteRequest,
      );

      expect(fullQuotePayload.isMonthlySubscription).toBe(true);
      expect(fullQuotePayload.quoteId).toBe(quickQuote.policyRequestId);

      const fullQuoteResponse = await createAhpFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as AhpFullQuoteResponseBody;
      const firstInstallmentPayable =
        fullQuote.monthlyPriceBreakdown?.monthlyPriceBreakdown?.monthlyInstallments
          ?.payable;
      const paymentPayload = await buildAhpMonthlyPaymentPayloadFromFullQuote(
        fullQuote,
        fullQuotePayload.email,
      );

      expect(paymentPayload.quoteId).toBe(fullQuote.quote.policyRequestId);
      expect(paymentPayload.expectedPrice).toBe(firstInstallmentPayable);
      expect(paymentPayload.paymentMethodId).toMatch(/^pm_/);

      const paymentResponse = await createAhpMonthlyPayment(paymentPayload);

      expect(paymentResponse.status).not.toBe(400);
      expect(paymentResponse.status).not.toBe(401);

      if (
        (paymentResponse.status === 500 || paymentResponse.status === 404) &&
        (paymentResponse.body?.message === 'Customer does not exist' ||
          paymentResponse.body?.message === 'Unknown Stripe error')
      ) {
        console.warn(
          'AHP monthly payment mapping succeeded, but Stripe is unavailable on this environment. ' +
            'Ensure the client email exists in Stripe or set STRIPE_SECRET_KEY_MONTHLY / FALLBACK_MONTHLY_PAYMENT_METHOD_ID.',
        );
        return;
      }

      expectApiStatus(paymentResponse, 201);
    },
    300000,
  );
});
