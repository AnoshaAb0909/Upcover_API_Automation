import { buildVizEndorsementAnnualPaymentPayload } from '../../../products/viz/data/endorsement.payment.payload';
import {
  buildVizEndorsementAnnualFullQuotePayload,
  buildVizEndorsementAnnualPayload,
} from '../../../products/viz/data/endorsement.payload';
import {
  vizEndorsementAnnualAdditionalOccupation,
  vizEndorsementTaxAuditTemplate,
  vizEndorsementToolsTemplate,
} from '../../../products/viz/data/endorsement.defaults';
import { vizEndorsementAnnualFullQuoteTemplate } from '../../../products/viz/data/endorsement.fullQuote.defaults';
import { resolveVizQuickQuoteId } from '../../../products/viz/data/fullQuote.payload';
import { buildVizAnnualPaymentPayloadFromFullQuote } from '../../../products/viz/data/payment.payload';
import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import {
  createVizEndorsement,
  createVizEndorsementAnnualPaymentWithApproval,
} from '../../../products/viz/services/endorsement.service';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import { createVizAnnualPayment } from '../../../products/viz/services/payment.service';
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

describe('Viz Annual Endorsement API', () => {
  let quickQuote: VizQuickQuoteResponse;
  let fullQuote: VizFullQuoteResponse;
  let parentQuoteId: string;
  let endorsementPayload: VizEndorsementPayload;
  let endorsement: VizEndorsementResponse;
  let stripeUnavailable = false;

  beforeAll(async () => {
    const quickQuoteResponse = await createVizQuickQuoteWithRetry(
      buildVizQuickQuotePayload,
    );

    expectApiStatus(quickQuoteResponse, 201);
    quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;

    const fullQuotePayload = buildVizEndorsementAnnualFullQuotePayload(quickQuote);
    const fullQuoteResponse = await createVizFullQuote(fullQuotePayload);

    expectApiStatus(fullQuoteResponse, 201);
    fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;
    parentQuoteId = fullQuote.fullQuote.id;

    const paymentPayload = await buildVizAnnualPaymentPayloadFromFullQuote(fullQuote);
    const paymentResponse = await createVizAnnualPayment(paymentPayload);

    if (isVizStripeUnavailable(paymentResponse.status, paymentResponse.body?.message)) {
      stripeUnavailable = true;
      console.warn(
        'Viz annual payment mapping succeeded, but Stripe is unavailable on this environment. ' +
          'Skipping endorsement because a bound annual policy is required.',
      );
      return;
    }

    expectApiStatus(paymentResponse, 201);
    endorsementPayload = buildVizEndorsementAnnualPayload(fullQuote);
  }, 300000);

  it('should map annual endorsement full quote payload from quick quote', () => {
    const quoteId = resolveVizQuickQuoteId(quickQuote);
    const fullQuotePayload = buildVizEndorsementAnnualFullQuotePayload(quickQuote);

    expect(fullQuotePayload.quoteId).toBe(quoteId);
    expect(fullQuotePayload.metadata.quoteId).toBe(quoteId);
    expect(fullQuotePayload.clientInformation).toEqual(quickQuote.req.clientInformation);
    expect(fullQuotePayload.isMonthlySubscription).toBe(false);
    expect(fullQuotePayload.companyName).toBe(
      vizEndorsementAnnualFullQuoteTemplate.companyName,
    );
    expect(fullQuotePayload.companyRevenue).toBe(
      vizEndorsementAnnualFullQuoteTemplate.companyRevenue,
    );
    expect(fullQuotePayload.state).toBe('VIC');
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

  it('should bind an annual policy before creating an endorsement', () => {
    if (stripeUnavailable) {
      return;
    }

    expect(parentQuoteId).toMatch(/^viz_/);
    expect(fullQuote.fullQuote.isMonthlySubscription).toBe(false);
    expect(fullQuote.fullQuote.priceBreakdown.clientPayable).toBeTruthy();
  });

  it('should map annual endorsement payload from the bound policy', () => {
    if (stripeUnavailable) {
      return;
    }

    const req = fullQuote.fullQuote.req;

    expect(endorsementPayload.parentQuoteId).toBe(parentQuoteId);
    expect(endorsementPayload.metadata.quoteId).toBe(parentQuoteId);
    expect(endorsementPayload.metadata.flow).toBe('endorsement');
    expect(endorsementPayload.companyName).toBe(req.companyName);
    expect(endorsementPayload.companyAddress).toEqual(req.companyAddress);
    expect(endorsementPayload.clientInformation).toEqual(req.clientInformation);
    expect(endorsementPayload.occupations).toEqual([
      ...req.occupations,
      vizEndorsementAnnualAdditionalOccupation,
    ]);
    expect(endorsementPayload.isMonthlySubscription).toBe(false);
    expect(endorsementPayload.tools).toEqual(vizEndorsementToolsTemplate);
    expect(endorsementPayload.taxAudit).toEqual(vizEndorsementTaxAuditTemplate);
  });

  it('should create an annual endorsement full quote', async () => {
    if (stripeUnavailable) {
      return;
    }

    const endorsementResponse = await createVizEndorsement(endorsementPayload);

    expectApiStatus(endorsementResponse, 201);
    endorsement = endorsementResponse.body as VizEndorsementResponse;

    expect(endorsement.fullQuote?.id).toMatch(/^viz_/);
    expect(endorsement.fullQuote?.priceBreakdown.clientPayable).toBeTruthy();
  });

  it('should pay the annual endorsement quote', async () => {
    if (stripeUnavailable) {
      return;
    }

    const endorsementPaymentPayload =
      await buildVizEndorsementAnnualPaymentPayload(endorsement);

    expect(endorsementPaymentPayload.quoteId).toBe(endorsement.fullQuote!.id);
    expect(endorsementPaymentPayload.expectedPrice).toBe(
      endorsement.fullQuote!.priceBreakdown.clientPayable,
    );
    expect(endorsementPaymentPayload.paymentMethodId).toMatch(/^pm_/);

    const endorsementPaymentResponse = await createVizEndorsementAnnualPaymentWithApproval(
      endorsementPaymentPayload,
    );

    if (isVizStripeUnavailable(endorsementPaymentResponse.status, endorsementPaymentResponse.body?.message)) {
      console.warn(
        'Viz endorsement annual payment mapping succeeded, but Stripe is unavailable on this environment.',
      );
      return;
    }

    expectApiStatus(endorsementPaymentResponse, 201);
  });
});
