import {
  resolveAhpFullQuoteId,
} from '../../../products/ahp/data/payment.mapper';
import {
  buildAhpAnnualPaymentPayloadFromFullQuote,
  buildAhpMonthlyPaymentPayloadFromFullQuote,
} from '../../../products/ahp/data/payment.payload';
import type {
  AhpAnnualPaymentPayload,
  AhpMonthlyPaymentPayload,
} from '../../../products/ahp/types/payment.payload.types';
import { expectAhpFullQuoteResponse, expectAhpPaymentPayload } from './ahpFlowExpectations';
import {
  type AhpFlowContext,
  type AhpSubscriptionMode,
  resolveAhpQuickQuoteId,
  runAhpFullQuoteStep,
  runAhpPaymentStep,
  runAhpQuickQuoteStep,
} from './ahpSubscriptionFlow';

const FLOW_TIMEOUT_MS = 300000;

export function defineAhpFlowTests(
  mode: AhpSubscriptionMode,
  suiteTitle: string,
): void {
  const isMonthly = mode === 'monthly';
  const paymentLabel = isMonthly ? 'monthly' : 'annual';

  describe(suiteTitle, () => {
    describe('Quick Quote', () => {
      let quickQuoteRequest: Awaited<
        ReturnType<typeof runAhpQuickQuoteStep>
      >['quickQuoteRequest'];
      let quickQuote: Awaited<ReturnType<typeof runAhpQuickQuoteStep>>['quickQuote'];

      beforeAll(async () => {
        ({ quickQuoteRequest, quickQuote } = await runAhpQuickQuoteStep());
      }, FLOW_TIMEOUT_MS);

      it('should return a UUID policyRequestId', () => {
        expect(quickQuote.policyRequestId).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        );
      });

      it('should return a reference number and cover premium breakdown', () => {
        expect(quickQuote.referenceNumber).toBeTruthy();
        expect(quickQuote.totalPremium[0].premium.clientPayable).toBeGreaterThan(0);
        expect(quickQuote.totalPremium[0].title).toBeTruthy();
      });

      it('should echo cover input id in coverInputs', () => {
        expect(quickQuote.coverInputs[0].id).toBe(
          quickQuoteRequest.coverInput[0].coverId,
        );
        expect(quickQuote.referralDeclineReasons).toEqual([]);
      });
    });

    describe('Full Quote', () => {
      let context: AhpFlowContext;

      beforeAll(async () => {
        context = await runAhpFullQuoteStep(mode);
      }, FLOW_TIMEOUT_MS);

      it('should map quick quote policyRequestId into full quote payload quoteId', () => {
        const quoteId = resolveAhpQuickQuoteId(context.quickQuote);
        expect(context.fullQuotePayload.quoteId).toBe(quoteId);
      });

      it(`should set isMonthlySubscription to ${isMonthly}`, () => {
        expect(context.fullQuotePayload.isMonthlySubscription).toBe(isMonthly);
      });

      it('should map occupations, states, and revenue from quick quote request', () => {
        expect(context.fullQuotePayload.revenueLastFy).toBe(
          context.quickQuoteRequest.averageRevenue,
        );
        expect(context.fullQuotePayload.occupations[0].occupationId).toBe(
          context.quickQuoteRequest.occupations[0].id,
        );
        expect(context.fullQuotePayload.statesSplit[0].id).toBe(
          context.quickQuoteRequest.states[0].id,
        );
      });

      it('should return bound quote with matching policyRequestId', () => {
        expect(context.fullQuote.quote.policyRequestId).toBe(
          resolveAhpQuickQuoteId(context.quickQuote),
        );
        expectAhpFullQuoteResponse(context.fullQuote, context.quickQuote, mode);
      });

      if (isMonthly) {
        it('should include monthly price breakdown and installment dates', () => {
          expect(
            context.fullQuote.monthlyPriceBreakdown?.monthlyPriceBreakdown
              ?.monthlyInstallments?.payable,
          ).toBeGreaterThan(0);
          expect(context.fullQuote.installmentDates?.length).toBeGreaterThan(0);
        });
      }
    });

    describe(`${paymentLabel} payment mapping`, () => {
      let context: AhpFlowContext;
      let paymentPayload: AhpAnnualPaymentPayload | AhpMonthlyPaymentPayload;

      beforeAll(async () => {
        context = await runAhpFullQuoteStep(mode);
        paymentPayload = isMonthly
          ? await buildAhpMonthlyPaymentPayloadFromFullQuote(
              context.fullQuote,
              context.fullQuotePayload.email,
            )
          : await buildAhpAnnualPaymentPayloadFromFullQuote(
              context.fullQuote,
              context.fullQuotePayload.email,
            );
      }, FLOW_TIMEOUT_MS);

      it('should map quoteId from full quote response', () => {
        expect(paymentPayload.quoteId).toBe(resolveAhpFullQuoteId(context.fullQuote));
      });

      it('should resolve expectedPrice from full quote premium breakdown', () => {
        expectAhpPaymentPayload(paymentPayload, context.fullQuote, mode);
      });

      it('should resolve a Stripe payment method id', () => {
        expect(paymentPayload.paymentMethodId).toMatch(/^pm_/);
      });

      it('should build payment payload without coupon fields', () => {
        expect(paymentPayload).not.toHaveProperty('couponId');
        expect(paymentPayload).not.toHaveProperty('isCouponApplied');
      });
    });

    describe(`${paymentLabel} payment API`, () => {
      it(`should post ${paymentLabel} payment for the bound quote`, async () => {
        await runAhpPaymentStep(mode);
      }, FLOW_TIMEOUT_MS);
    });
  });
}
