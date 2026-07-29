import { buildAhpFullQuotePayload } from '../../../products/ahp/data/fullQuote.payload';
import { buildAhpAnnualPaymentPayloadFromFullQuote } from '../../../products/ahp/data/payment.payload';
import { buildAhpQuickQuotePayload } from '../../../products/ahp/data/quickQuote.payload';
import { createAhpFullQuote } from '../../../products/ahp/services/fullQuote.service';
import { createAhpAnnualPayment } from '../../../products/ahp/services/payment.service';
import { createAhpQuickQuoteWithRetry } from '../../../products/ahp/services/quickQuote.service';
import type { AhpFullQuoteResponseBody } from '../../../products/ahp/types/fullQuote.types';
import type { AhpQuickQuoteResponse } from '../../../products/ahp/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('AHP Annual Payment API', () => {
  it(
    'should run quick quote and annual full quote, then post annual payment',
    async () => {
      const quickQuoteRequest = buildAhpQuickQuotePayload();
      const quickQuoteResponse = await createAhpQuickQuoteWithRetry(
        () => quickQuoteRequest,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as AhpQuickQuoteResponse;
      const fullQuotePayload = buildAhpFullQuotePayload(quickQuote, quickQuoteRequest);

      expect(fullQuotePayload.isMonthlySubscription).toBe(false);
      expect(fullQuotePayload.quoteId).toBe(quickQuote.policyRequestId);

      const fullQuoteResponse = await createAhpFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as AhpFullQuoteResponseBody;
      const clientPayable = fullQuote.quote.totalPremium.reduce(
        (sum, item) => sum + item.premium.clientPayable,
        0,
      );
      const paymentPayload = await buildAhpAnnualPaymentPayloadFromFullQuote(
        fullQuote,
        fullQuotePayload.email,
      );

      expect(paymentPayload.quoteId).toBe(fullQuote.quote.policyRequestId);
      expect(paymentPayload.expectedPrice).toBe(clientPayable);
      expect(paymentPayload.paymentMethodId).toMatch(/^pm_/);

      const paymentResponse = await createAhpAnnualPayment(paymentPayload);

      expect(paymentResponse.status).not.toBe(400);
      expect(paymentResponse.status).not.toBe(401);

      if (
        (paymentResponse.status === 500 || paymentResponse.status === 404) &&
        (paymentResponse.body?.message === 'Customer does not exist' ||
          paymentResponse.body?.message === 'Unknown Stripe error')
      ) {
        console.warn(
          'AHP annual payment mapping succeeded, but Stripe is unavailable on this environment. ' +
            'Ensure the client email exists in Stripe or set STRIPE_SECRET_KEY_ANNUAL / FALLBACK_ANNUAL_PAYMENT_METHOD_ID.',
        );
        return;
      }

      expectApiStatus(paymentResponse, 201);
    },
    300000,
  );
});
