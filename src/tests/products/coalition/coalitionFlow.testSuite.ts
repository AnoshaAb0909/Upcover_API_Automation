import { COALITION_NOTIFICATION_EMAIL } from '../../../products/coalition/data/coalitionNotificationEmail';
import { COALITION_FULL_QUOTE_DOMAIN_NAMES } from '../../../products/coalition/data/fullQuote.defaults';
import { resolveQuickQuoteId } from '../../../products/coalition/data/fullQuote.payload';
import {
  buildAnnualPaymentPayloadFromFullQuote,
  buildMonthlyPaymentPayloadFromFullQuote,
} from '../../../products/coalition/data/payment.payload';
import { buildQuoteDocsEmailPayload } from '../../../products/coalition/data/quoteDocsEmail.payload';
import {
  createAnnualPayment,
  createMonthlyPayment,
} from '../../../products/coalition/services/payment.service';
import { emailQuoteDocs } from '../../../products/coalition/services/quoteDocsEmail.service';
import type {
  AnnualPaymentPayload,
  MonthlyPaymentPayload,
} from '../../../products/coalition/types/payment.payload.types';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';
import { expectCoalitionPaymentResponse } from './coalitionFlowExpectations';
import {
  type CoalitionFlowContext,
  type CoalitionSubscriptionMode,
  runCoalitionFullQuoteStep,
  runCoalitionQuickQuoteStep,
} from './coalitionSubscriptionFlow';

const FLOW_TIMEOUT_MS = 300000;

export function defineCoalitionFlowTests(
  mode: CoalitionSubscriptionMode,
  suiteTitle: string,
): void {
  const isMonthly = mode === 'monthly';
  const paymentLabel = isMonthly ? 'monthly' : 'annual';

  describe(suiteTitle, () => {
    describe('Quick Quote', () => {
      let quickQuote: QuickQuoteResponse;

      beforeAll(async () => {
        quickQuote = await runCoalitionQuickQuoteStep(mode);
      }, FLOW_TIMEOUT_MS);

      it('should return a col_ prefixed quote id', () => {
        expect(quickQuote.id).toMatch(/^col_/);
      });

      it('should return company name echoed in coalition res', () => {
        expect(quickQuote.req.companyName).toBeTruthy();
        expect(quickQuote.res.companyName).toBe(quickQuote.req.companyName);
      });

      it('should return company revenue echoed in coalition res', () => {
        expect(quickQuote.req.companyRevenue).toBeGreaterThan(0);
        expect(quickQuote.res.companyRevenue).toBe(quickQuote.req.companyRevenue);
      });

      it('should return aggregate limit echoed in coalition res', () => {
        expect(quickQuote.req.aggregateLimit).toBeGreaterThan(0);
        expect(quickQuote.res.aggregateLimit).toBe(quickQuote.req.aggregateLimit);
      });
    });

    describe('Full Quote', () => {
      let context: CoalitionFlowContext;

      beforeAll(async () => {
        context = await runCoalitionFullQuoteStep(mode);
      }, FLOW_TIMEOUT_MS);

      it('should map quick quote id into full quote payload quoteId', () => {
        const quoteId = resolveQuickQuoteId(context.quickQuote);
        expect(context.fullQuotePayload.quoteId).toBe(quoteId);
        expect(context.fullQuotePayload.metadata.quoteId).toBe(quoteId);
      });

      it('should set hasDomains Yes and coalition domain names on payload', () => {
        expect(context.fullQuotePayload.declarations.hasDomains).toBe('Yes');
        expect(context.fullQuotePayload.domainNames).toEqual(
          COALITION_FULL_QUOTE_DOMAIN_NAMES,
        );
      });

      it(`should set isMonthlySubscription to ${isMonthly} with policy dates`, () => {
        expect(context.fullQuotePayload.isMonthlySubscription).toBe(isMonthly);
        expect(context.fullQuotePayload.policyStartDate).toBeTruthy();
        expect(context.fullQuotePayload.policyExpiryDate).toBeTruthy();
      });

      it('should return a new full quote id linked to the quick quote id', () => {
        expect(context.fullQuote.fullQuote.id).toMatch(/^col_/);
        expect(context.fullQuote.fullQuote.id).not.toBe(context.quickQuote.id);
        expect(context.fullQuote.fullQuote.req.quoteId).toBe(context.quickQuote.id);
      });

      if (isMonthly) {
        it('should return clientPayable and monthly installment pricing', () => {
          const breakdown = context.fullQuote.fullQuote.monthlyPriceBreakdown;
          expect(breakdown.clientPayable).toBeGreaterThan(0);
          expect(breakdown.monthlyBreakdown?.firstInstallmentPayable).toBeGreaterThan(0);
          expect(breakdown.monthlyBreakdown?.monthlyPayable).toBeGreaterThan(0);
        });
      } else {
        it('should return clientPayable and persist domain fields on response', () => {
          expect(
            context.fullQuote.fullQuote.monthlyPriceBreakdown.clientPayable,
          ).toBeGreaterThan(0);
          expect(context.fullQuote.fullQuote.req.declarations.hasDomains).toBe('Yes');
          expect(context.fullQuote.fullQuote.req.domainNames).toEqual(
            COALITION_FULL_QUOTE_DOMAIN_NAMES,
          );
        });
      }
    });

    describe('Quote Docs Email', () => {
      let context: CoalitionFlowContext;
      let quoteDocsPayload: ReturnType<typeof buildQuoteDocsEmailPayload>;

      beforeAll(async () => {
        context = await runCoalitionFullQuoteStep(mode);
        quoteDocsPayload = buildQuoteDocsEmailPayload(context.fullQuote);
      }, FLOW_TIMEOUT_MS);

      it('should map quote docs quoteId to full quote id', () => {
        expect(quoteDocsPayload.quoteId).toBe(context.fullQuote.fullQuote.id);
      });

      it('should target coalition notification email', () => {
        expect(quoteDocsPayload.email).toBe(COALITION_NOTIFICATION_EMAIL);
      });

      it('should return 201 when emailing quote docs', async () => {
        const response = await emailQuoteDocs(quoteDocsPayload);
        expect(response.status).not.toBe(400);
        expect(response.status).not.toBe(401);
        expectApiStatus(response, 201);
      });
    });

    describe('Payment', () => {
      let context: CoalitionFlowContext;
      let paymentPayload: AnnualPaymentPayload | MonthlyPaymentPayload;

      beforeAll(async () => {
        context = await runCoalitionFullQuoteStep(mode);
        paymentPayload =
          mode === 'monthly'
            ? await buildMonthlyPaymentPayloadFromFullQuote(context.fullQuote)
            : await buildAnnualPaymentPayloadFromFullQuote(context.fullQuote);
      }, FLOW_TIMEOUT_MS);

      it('should map payment quoteId to full quote id', () => {
        expect(paymentPayload.quoteId).toBe(context.fullQuote.fullQuote.id);
      });

      it(`should map expectedPrice and payment method for ${paymentLabel} payment`, () => {
        const breakdown = context.fullQuote.fullQuote.monthlyPriceBreakdown;
        expect(paymentPayload.paymentMethodId).toMatch(/^pm_/);
        if (isMonthly) {
          expect(paymentPayload.expectedPrice).toBe(
            breakdown.monthlyBreakdown?.firstInstallmentPayable,
          );
        } else {
          expect(paymentPayload.expectedPrice).toBe(breakdown.clientPayable);
        }
      });

      it(`should return 201 when posting ${paymentLabel} payment`, async () => {
        const response =
          mode === 'monthly'
            ? await createMonthlyPayment(paymentPayload)
            : await createAnnualPayment(paymentPayload);

        expect(response.status).not.toBe(400);
        expect(response.status).not.toBe(401);

        if (
          (response.status === 500 || response.status === 404) &&
          response.body?.message === 'Customer does not exist'
        ) {
          console.warn(
            `Coalition ${mode} payment skipped: Stripe customer missing on this environment.`,
          );
          return;
        }

        expectApiStatus(response, 201);
        expectCoalitionPaymentResponse(response.body);
      });
    });
  });
}
