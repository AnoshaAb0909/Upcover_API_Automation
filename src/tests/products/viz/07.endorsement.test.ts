import { buildVizEndorsementMonthlyPaymentPayload } from '../../../products/viz/data/endorsement.payment.payload';
import {
  buildVizEndorsementMonthlyFullQuotePayload,
  buildVizEndorsementMonthlyPayload,
} from '../../../products/viz/data/endorsement.payload';
import {
  vizEndorsementMonthlyAdditionalOccupation,
  vizEndorsementTaxAuditTemplate,
  vizEndorsementToolsTemplate,
} from '../../../products/viz/data/endorsement.defaults';
import { vizEndorsementMonthlyFullQuoteTemplate } from '../../../products/viz/data/endorsement.fullQuote.defaults';
import { resolveVizQuickQuoteId } from '../../../products/viz/data/fullQuote.payload';
import { buildVizMonthlyPaymentPayloadFromFullQuote } from '../../../products/viz/data/payment.payload';
import { buildVizMonthlyQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import {
  createVizEndorsement,
  createVizEndorsementMonthlyPaymentWithApproval,
} from '../../../products/viz/services/endorsement.service';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import { createVizMonthlyPayment } from '../../../products/viz/services/payment.service';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizEndorsementPayload } from '../../../products/viz/types/endorsement.payload.types';
import type { VizEndorsementResponse } from '../../../products/viz/types/endorsement.payload.types';
import type { VizFullQuoteResponse } from '../../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

function isVizStripeUnavailable(status: number, message: unknown): boolean {
  return (
    (status === 500 || status === 404) &&
    (message === 'Customer does not exist' || message === 'Unknown Stripe error')
  );
}

describe('Viz Monthly Endorsement API', () => {
  let quickQuote: VizQuickQuoteResponse;
  let fullQuote: VizFullQuoteResponse;
  let parentQuoteId: string;
  let endorsementPayload: VizEndorsementPayload;
  let endorsement: VizEndorsementResponse;
  let stripeUnavailable = false;

  beforeAll(async () => {
    const quickQuoteResponse = await createVizQuickQuoteWithRetry(
      buildVizMonthlyQuickQuotePayload,
    );

    expectApiStatus(quickQuoteResponse, 201);
    quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;

    const fullQuotePayload = buildVizEndorsementMonthlyFullQuotePayload(quickQuote);
    const fullQuoteResponse = await createVizFullQuote(fullQuotePayload);

    expectApiStatus(fullQuoteResponse, 201);
    fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;
    parentQuoteId = fullQuote.fullQuote.id;

    const paymentPayload = await buildVizMonthlyPaymentPayloadFromFullQuote(fullQuote);
    const paymentResponse = await createVizMonthlyPayment(paymentPayload);

    if (isVizStripeUnavailable(paymentResponse.status, paymentResponse.body?.message)) {
      stripeUnavailable = true;
      console.warn(
        'Viz monthly payment mapping succeeded, but Stripe is unavailable on this environment. ' +
          'Skipping endorsement because a bound monthly policy is required.',
      );
      return;
    }

    expectApiStatus(paymentResponse, 201);
    endorsementPayload = buildVizEndorsementMonthlyPayload(fullQuote);
  }, 300000);

  it('should map monthly endorsement full quote payload from quick quote', () => {
    const quoteId = resolveVizQuickQuoteId(quickQuote);
    const fullQuotePayload = buildVizEndorsementMonthlyFullQuotePayload(quickQuote);

    expect(fullQuotePayload.quoteId).toBe(quoteId);
    expect(fullQuotePayload.metadata.quoteId).toBe(quoteId);
    expect(fullQuotePayload.clientInformation.email).toContain('@upcover.com');
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
  });

  it('should bind a monthly policy before creating an endorsement', () => {
    if (stripeUnavailable) {
      return;
    }

    expect(parentQuoteId).toMatch(/^viz_/);
    expect(fullQuote.fullQuote.isMonthlySubscription).toBe(true);
    expect(fullQuote.fullQuote.priceBreakdown.clientPayable).toBeTruthy();
  });

  it('should map monthly endorsement payload from the bound policy', () => {
    if (stripeUnavailable) {
      return;
    }

    const req = fullQuote.fullQuote.req;

    expect(endorsementPayload.parentQuoteId).toBe(parentQuoteId);
    expect(endorsementPayload.metadata.quoteId).toBe(parentQuoteId);
    expect(endorsementPayload.metadata.flow).toBe('endorsement');
    expect(endorsementPayload.companyName).toBe(req.companyName);
    expect(endorsementPayload.companyRevenue).toBe(req.companyRevenue);
    expect(endorsementPayload.companyAddress).toEqual(req.companyAddress);
    expect(endorsementPayload.abnDetails).toEqual(req.abnDetails);
    expect(endorsementPayload.clientInformation).toEqual(req.clientInformation);
    expect(endorsementPayload.occupations).toEqual([
      ...req.occupations,
      vizEndorsementMonthlyAdditionalOccupation,
    ]);
    expect(endorsementPayload.tools).toEqual(vizEndorsementToolsTemplate);
    expect(endorsementPayload.taxAudit).toEqual(vizEndorsementTaxAuditTemplate);
  });

  it('should create a monthly endorsement full quote', async () => {
    if (stripeUnavailable) {
      return;
    }

    const endorsementResponse = await createVizEndorsement(endorsementPayload);

    expectApiStatus(endorsementResponse, 201);
    endorsement = endorsementResponse.body as VizEndorsementResponse;

    expect(endorsement.fullQuote?.id).toMatch(/^viz_/);
    expect(endorsement.fullQuote?.priceBreakdown.clientPayable).toBeTruthy();
  });

  it('should pay the monthly endorsement quote', async () => {
    if (stripeUnavailable) {
      return;
    }

    const endorsementPaymentPayload =
      await buildVizEndorsementMonthlyPaymentPayload(endorsement);

    expect(endorsementPaymentPayload.quoteId).toBe(endorsement.fullQuote!.id);
    expect(endorsementPaymentPayload.expectedPrice).toBe(
      endorsement.fullQuote!.priceBreakdown.clientPayable,
    );
    expect(endorsementPaymentPayload.paymentMethodId).toMatch(/^pm_/);

    const endorsementPaymentResponse = await createVizEndorsementMonthlyPaymentWithApproval(
      endorsementPaymentPayload,
    );

    if (isVizStripeUnavailable(endorsementPaymentResponse.status, endorsementPaymentResponse.body?.message)) {
      console.warn(
        'Viz endorsement monthly payment mapping succeeded, but Stripe is unavailable on this environment.',
      );
      return;
    }

    expectApiStatus(endorsementPaymentResponse, 201);
  });
});
