import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import {
  buildVizEndorsementAnnualFullQuotePayload,
  buildVizEndorsementAnnualPayload,
  buildVizEndorsementMonthlyFullQuotePayload,
  buildVizEndorsementMonthlyPayload,
} from '../../../products/viz/data/endorsement.payload';
import {
  mapVizEndorsementResponseToAnnualPaymentPayload,
  mapVizEndorsementResponseToMonthlyPaymentPayload,
  resolveVizEndorsementClientPayable,
  resolveVizEndorsementQuoteId,
} from '../../../products/viz/data/endorsement.payment.payload';
import {
  resolveVizEndorsementAdditionalOccupation,
  vizEndorsementAnnualAdditionalOccupation,
  vizEndorsementMonthlyAdditionalOccupation,
  vizEndorsementTaxAuditTemplate,
  vizEndorsementToolsTemplate,
} from '../../../products/viz/data/endorsement.defaults';
import {
  vizEndorsementAnnualFullQuoteTemplate,
  vizEndorsementMonthlyFullQuoteTemplate,
} from '../../../products/viz/data/endorsement.fullQuote.defaults';
import {
  resolveVizClientPayable,
  resolveVizFirstInstallmentPayable,
  resolveVizFullQuoteId,
} from '../../../products/viz/data/payment.mapper';
import {
  buildMockVizEndorsementResponse,
  buildMockVizFullQuoteResponse,
  buildMockVizQuickQuoteResponse,
} from '../../helpers/vizMockFixtures';

describe('Viz quick quote payload mapping', () => {
  it('should generate client information with email and phone number', () => {
    const payload = buildVizQuickQuotePayload();

    expect(payload.clientInformation.email).toContain('@');
    expect(payload.clientInformation.firstName).toBeTruthy();
    expect(payload.clientInformation.lastName).toBeTruthy();
    expect(payload.clientInformation.phoneNumber).toMatch(/^04/);
    expect(payload.partnerId).toBe('upcover');
  });

  it('should keep default aggregate limit and excess values', () => {
    const payload = buildVizQuickQuotePayload();

    expect(payload.aggregateLimit).toBe(5000000);
    expect(payload.excess).toBe(500);
    expect(payload.state).toBe('NSW');
  });
});

describe('Viz endorsement full quote payload mapping', () => {
  const quickQuote = buildMockVizQuickQuoteResponse();

  it('should map monthly endorsement full quote fields from quick quote', () => {
    const payload = buildVizEndorsementMonthlyFullQuotePayload(quickQuote);

    expect(payload.quoteId).toBe(quickQuote.id);
    expect(payload.metadata.quoteId).toBe(quickQuote.id);
    expect(payload.clientInformation).toEqual(quickQuote.req.clientInformation);
    expect(payload.isMonthlySubscription).toBe(true);
    expect(payload.companyName).toBe(vizEndorsementMonthlyFullQuoteTemplate.companyName);
    expect(payload.state).toBe('QLD');
  });

  it('should map annual endorsement full quote fields from quick quote', () => {
    const payload = buildVizEndorsementAnnualFullQuotePayload(quickQuote);

    expect(payload.quoteId).toBe(quickQuote.id);
    expect(payload.metadata.quoteId).toBe(quickQuote.id);
    expect(payload.clientInformation).toEqual(quickQuote.req.clientInformation);
    expect(payload.isMonthlySubscription).toBe(false);
    expect(payload.companyName).toBe(vizEndorsementAnnualFullQuoteTemplate.companyName);
    expect(payload.state).toBe('VIC');
  });
});

describe('Viz endorsement payload mapping', () => {
  const fullQuote = buildMockVizFullQuoteResponse();

  it('should append the monthly additional occupation', () => {
    const payload = buildVizEndorsementMonthlyPayload(fullQuote);

    expect(payload.occupations.at(-1)).toEqual(vizEndorsementMonthlyAdditionalOccupation);
    expect(payload.metadata.flow).toBe('endorsement');
    expect(payload.tools).toEqual(vizEndorsementToolsTemplate);
    expect(payload.taxAudit).toEqual(vizEndorsementTaxAuditTemplate);
  });

  it('should append the annual additional occupation', () => {
    const payload = buildVizEndorsementAnnualPayload(fullQuote);

    expect(payload.occupations.at(-1)).toEqual(vizEndorsementAnnualAdditionalOccupation);
    expect(payload.isMonthlySubscription).toBe(false);
  });

  it('should normalize ISO policy dates to YYYY-MM-DD', () => {
    const payload = buildVizEndorsementAnnualPayload(fullQuote);

    expect(payload.policyStartDate).toBe('2026-07-21');
    expect(payload.policyExpiryDate).toBe('2027-07-21');
    expect(payload.endorsementEffectiveDate).toBe(payload.policyStartDate);
  });

  it('should map client and company details from the bound policy request', () => {
    const payload = buildVizEndorsementAnnualPayload(fullQuote);
    const req = fullQuote.fullQuote.req;

    expect(payload.parentQuoteId).toBe(fullQuote.fullQuote.id);
    expect(payload.clientInformation).toEqual(req.clientInformation);
    expect(payload.companyName).toBe(req.companyName);
    expect(payload.companyAddress).toEqual(req.companyAddress);
    expect(payload.abnDetails).toEqual(req.abnDetails);
  });

  it('should resolve billing-mode specific additional occupations', () => {
    expect(resolveVizEndorsementAdditionalOccupation('monthly')).toEqual(
      vizEndorsementMonthlyAdditionalOccupation,
    );
    expect(resolveVizEndorsementAdditionalOccupation('annual')).toEqual(
      vizEndorsementAnnualAdditionalOccupation,
    );
  });
});

describe('Viz payment payload mapping', () => {
  const fullQuote = buildMockVizFullQuoteResponse();
  const endorsement = buildMockVizEndorsementResponse();

  it('should resolve full quote id and client payable from full quote response', () => {
    expect(resolveVizFullQuoteId(fullQuote)).toBe('viz_mock-bound-policy-id');
    expect(resolveVizClientPayable(fullQuote)).toBe(1234.56);
    expect(resolveVizFirstInstallmentPayable(fullQuote)).toBe(164.77);
  });

  it('should map monthly endorsement payment payload from endorsement response', () => {
    const payload = mapVizEndorsementResponseToMonthlyPaymentPayload(endorsement, {
      paymentMethodId: 'pm_test_monthly',
    });

    expect(payload.quoteId).toBe('viz_mock-endorsement-quote-id');
    expect(payload.expectedPrice).toBe(751.33);
    expect(payload.paymentMethodId).toBe('pm_test_monthly');
  });

  it('should map annual endorsement payment payload from endorsement response', () => {
    const payload = mapVizEndorsementResponseToAnnualPaymentPayload(endorsement, {
      paymentMethodId: 'pm_test_annual',
    });

    expect(resolveVizEndorsementQuoteId(endorsement)).toBe('viz_mock-endorsement-quote-id');
    expect(resolveVizEndorsementClientPayable(endorsement)).toBe(751.33);
    expect(payload.expectedPrice).toBe(751.33);
    expect(payload.paymentMethodId).toBe('pm_test_annual');
  });
});
