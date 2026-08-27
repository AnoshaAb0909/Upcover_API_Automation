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
      expect(quickQuote.body.req?.clientId).toBe(quickQuotePayload.clientId);
      expectApiStatus(quickQuote, 201);
      expect(quickQuote.body).toMatchObject({
        type: 'quick-quote',
        status: 'indicative-quote-generated',
      });
      expect(quickQuote.body.quoteNumber).toBeTruthy();
    },
    180000,
  );
});
