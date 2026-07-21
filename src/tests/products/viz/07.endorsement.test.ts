import { buildVizEndorsementMonthlyPaymentPayload } from '../../../products/viz/data/endorsement.payment.payload';
import {
  buildVizEndorsementMonthlyFullQuotePayload,
  buildVizEndorsementPayload,
} from '../../../products/viz/data/endorsement.payload';
import {
  vizEndorsementAdditionalOccupation,
  vizEndorsementTaxAuditTemplate,
  vizEndorsementToolsTemplate,
} from '../../../products/viz/data/endorsement.defaults';
import { vizEndorsementMonthlyFullQuoteTemplate } from '../../../products/viz/data/endorsement.fullQuote.defaults';
import { resolveVizQuickQuoteId } from '../../../products/viz/data/fullQuote.payload';
import { buildVizMonthlyPaymentPayloadFromFullQuote } from '../../../products/viz/data/payment.payload';
import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import { createVizEndorsement, createVizEndorsementMonthlyPaymentWithApproval } from '../../../products/viz/services/endorsement.service';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import { createVizMonthlyPayment } from '../../../products/viz/services/payment.service';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizEndorsementResponse } from '../../../products/viz/types/endorsement.payload.types';
import type { VizFullQuoteResponse } from '../../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('Viz Endorsement API', () => {
  it(
    'should create endorsement and pay monthly after quick quote, full quote, and payment',
    async () => {
      const quickQuoteResponse = await createVizQuickQuoteWithRetry(
        buildVizQuickQuotePayload,
      );

      expectApiStatus(quickQuoteResponse, 201);

      const quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;
      const quoteId = resolveVizQuickQuoteId(quickQuote);
      const fullQuotePayload = buildVizEndorsementMonthlyFullQuotePayload(quickQuote);

      expect(fullQuotePayload.quoteId).toBe(quoteId);
      expect(fullQuotePayload.metadata.quoteId).toBe(quoteId);
      expect(fullQuotePayload.clientInformation).toEqual(
        quickQuote.req.clientInformation,
      );
      expect(fullQuotePayload.isMonthlySubscription).toBe(true);
      expect(fullQuotePayload.companyName).toBe(
        vizEndorsementMonthlyFullQuoteTemplate.companyName,
      );
      expect(fullQuotePayload.companyRevenue).toBe(
        vizEndorsementMonthlyFullQuoteTemplate.companyRevenue,
      );
      expect(fullQuotePayload.state).toBe('QLD');
      expect(fullQuotePayload.tools).toEqual({
        include: false,
        items: [],
        excessAmount: 0,
      });
      expect(fullQuotePayload.taxAudit).toEqual({
        include: false,
        excessAmount: 0,
      });

      const fullQuoteResponse = await createVizFullQuote(fullQuotePayload);

      expectApiStatus(fullQuoteResponse, 201);

      const fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;
      const parentQuoteId = fullQuote.fullQuote.id;
      const paymentPayload = await buildVizMonthlyPaymentPayloadFromFullQuote(fullQuote);

      expect(paymentPayload.quoteId).toBe(parentQuoteId);

      const paymentResponse = await createVizMonthlyPayment(paymentPayload);

      if (
        (paymentResponse.status === 500 || paymentResponse.status === 404) &&
        (paymentResponse.body?.message === 'Customer does not exist' ||
          paymentResponse.body?.message === 'Unknown Stripe error')
      ) {
        console.warn(
          'Viz monthly payment mapping succeeded, but Stripe is unavailable on this environment. ' +
            'Skipping endorsement because a bound monthly policy is required.',
        );
        return;
      }

      expectApiStatus(paymentResponse, 201);

      const req = fullQuote.fullQuote.req;
      const endorsementPayload = buildVizEndorsementPayload(fullQuote);

      expect(endorsementPayload.parentQuoteId).toBe(parentQuoteId);
      expect(endorsementPayload.metadata.quoteId).toBe(parentQuoteId);
      expect(endorsementPayload.metadata.flow).toBe('endorsement');
      expect(endorsementPayload.companyName).toBe(req.companyName);
      expect(endorsementPayload.companyRevenue).toBe(req.companyRevenue);
      expect(endorsementPayload.companyAddress).toEqual(req.companyAddress);
      expect(endorsementPayload.abnDetails).toEqual(req.abnDetails);
      expect(endorsementPayload.state).toBe(req.state);
      expect(endorsementPayload.clientInformation).toEqual(req.clientInformation);
      expect(endorsementPayload.aggregateLimit).toBe(req.aggregateLimit);
      expect(endorsementPayload.excess).toBe(req.excess);
      expect(endorsementPayload.isCouponApplied).toBe(false);
      expect(endorsementPayload.policyStartDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(endorsementPayload.policyExpiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(endorsementPayload.endorsementEffectiveDate).toBe(
        endorsementPayload.policyStartDate,
      );
      expect(endorsementPayload.occupations).toEqual([
        ...req.occupations,
        vizEndorsementAdditionalOccupation,
      ]);
      expect(endorsementPayload.isMonthlySubscription).toBe(
        fullQuote.fullQuote.isMonthlySubscription,
      );
      expect(endorsementPayload.tools).toEqual(vizEndorsementToolsTemplate);
      expect(endorsementPayload.taxAudit).toEqual(vizEndorsementTaxAuditTemplate);

      const endorsementResponse = await createVizEndorsement(endorsementPayload);

      expectApiStatus(endorsementResponse, 201);

      const endorsement = endorsementResponse.body as VizEndorsementResponse;
      const endorsementQuoteId = endorsement.fullQuote!.id;

      expect(endorsementQuoteId).toBeTruthy();
      expect(endorsementQuoteId.startsWith('viz_')).toBe(true);

      const endorsementPaymentPayload =
        await buildVizEndorsementMonthlyPaymentPayload(endorsement);

      expect(endorsementPaymentPayload.quoteId).toBe(endorsementQuoteId);
      expect(endorsementPaymentPayload.expectedPrice).toBe(
        endorsement.fullQuote!.priceBreakdown.clientPayable,
      );
      expect(endorsementPaymentPayload.paymentMethodId).toMatch(/^pm_/);

      const endorsementPaymentResponse = await createVizEndorsementMonthlyPaymentWithApproval(
        endorsementPaymentPayload,
      );

      if (
        (endorsementPaymentResponse.status === 500 ||
          endorsementPaymentResponse.status === 404) &&
        (endorsementPaymentResponse.body?.message === 'Customer does not exist' ||
          endorsementPaymentResponse.body?.message === 'Unknown Stripe error')
      ) {
        console.warn(
          'Viz endorsement monthly payment mapping succeeded, but Stripe is unavailable on this environment.',
        );
        return;
      }

      expectApiStatus(endorsementPaymentResponse, 201);
    },
    300000,
  );
});
