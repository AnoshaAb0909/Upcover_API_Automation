import type { MotorTotQuickQuoteResponse } from '../../../products/motorTot/types/quickQuote.response.types';
import { runMotorTotQuickQuoteFlow } from './motorTotAuthFlow';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('MotorTOT AU Quick Quote API', () => {
  it(
    'should create a quick quote using the OTP verify access token as Bearer auth',
    async () => {
      const { register, accessToken, quickQuotePayload, quickQuote } =
        await runMotorTotQuickQuoteFlow();

      expect(accessToken).toBeTruthy();
      expect(register.payload.email).toMatch(/@.+\.mailosaur\.net$/);
      expect(quickQuotePayload.clientId).toMatch(/^UPC-[A-Z0-9]{6}$/);
      expectApiStatus(quickQuote, 201);

      const data = quickQuote.body as MotorTotQuickQuoteResponse;
      const vehicleCount = quickQuotePayload.vehicles.length;

      expect(data.id).toEqual(expect.any(String));
      expect(data.type).toBe('quick-quote');
      expect(data.status).toBe('indicative-quote-generated');
      expect(data.quoteNumber).toMatch(/^Q-CM-TOT-\d+$/);
      expect(data.insureMoProposalId).toMatch(/^Q-CM-TOT-\d+$/);
      expect(data.isMonthlySubscription).toBe(true);
      expect(Date.parse(data.createdAt)).not.toBeNaN();
      expect(Date.parse(data.updatedAt)).not.toBeNaN();

      expect(data.req.clientId).toBe(quickQuotePayload.clientId);
      expect(data.req.clientInformation.email).toBe(register.payload.email);
      expect(data.req.clientInformation.firstName).toBe(
        quickQuotePayload.clientInformation.firstName,
      );
      expect(data.req.vehicles).toHaveLength(vehicleCount);

      expect(data.rmDetails.email).toBe(register.payload.email);
      expect(data.rmDetails.userId).toBeTruthy();

      expect(data.res.status).toBe('RATED');
      expect(data.res.proposalNo).toBe(data.insureMoProposalId);
      expect(data.res.policy.transactionStatusCode).toBe('RATED');
      expect(data.res.policy.numberOfVehicles).toBe(vehicleCount);
      expect(data.res.vehicles).toHaveLength(vehicleCount);
      expect(data.res.premium.totalPremium).toBeGreaterThan(0);
      expect(data.res.premium.grossPremium).toBeGreaterThan(0);

      expect(data.annualPremium.totalPremium).toBeGreaterThan(0);
      expect(data.annualPremium.gst).toBeGreaterThanOrEqual(0);
      expect(data.monthlyPremium.totalPremium).toBeGreaterThan(0);
      expect(data.monthlyPremium.totalPremium).toBeLessThan(
        data.annualPremium.totalPremium,
      );
    },
    180000,
  );
});
