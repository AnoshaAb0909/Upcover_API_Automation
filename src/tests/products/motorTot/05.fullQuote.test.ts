import type { MotorTotFullQuoteResponse } from '../../../products/motorTot/types/fullQuote.response.types';
import type { MotorTotQuickQuoteResponse } from '../../../products/motorTot/types/quickQuote.response.types';
import { runMotorTotFullQuoteFlow } from './motorTotAuthFlow';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('MotorTOT AU Full Quote API', () => {
  it(
    'should create a full quote using the quick quote id as quoteId',
    async () => {
      const {
        register,
        quickQuote,
        quickQuoteId,
        fullQuotePayload,
        fullQuote,
      } = await runMotorTotFullQuoteFlow();

      const quickQuoteBody = quickQuote.body as MotorTotQuickQuoteResponse;
      expect(quickQuoteBody.status).toBe('indicative-quote-generated');

      expect(fullQuotePayload.quoteId).toBe(quickQuoteId);
      expectApiStatus(fullQuote, 201);

      const data = fullQuote.body as MotorTotFullQuoteResponse;

      expect(data.id).toBe(quickQuoteId);
      expect(data.type).toBe('full-quote');
      expect(data.status).toBe('full-quote-generated');
      expect(data.quoteNumber).toMatch(/^Q-CM-TOT-\d+$/);
      expect(data.req.clientInformation.email).toBe(register.payload.email);
      expect(data.req.vehicles.length).toBeGreaterThan(0);
      expect(data.res.status).toBe('RATED');
      expect(data.res.policy.transactionStatusCode).toBe('RATED');
      expect(data.res.premium.totalPremium).toBeGreaterThan(0);
      expect(data.res.declarations.insurerCancelledOrDeclined).toBe('NO');
      expect(data.res.declarations.criminalOffenceHistory).toBe('NO');
      expect(data.res.declarations.driversLicenseSuspended).toBe('NO');
      expect(fullQuotePayload.declarations.signOff.fullName).toBe('Umer Sajjad');
    },
    240000,
  );
});
