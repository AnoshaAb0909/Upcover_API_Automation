import {
  buildVizFullQuotePayload,
  buildVizMonthlyFullQuotePayload,
} from '../../../products/viz/data/fullQuote.payload';
import {
  buildVizAnnualPaymentPayloadFromFullQuote,
  buildVizMonthlyPaymentPayloadFromFullQuote,
} from '../../../products/viz/data/payment.payload';
import { buildVizProofOfInsuranceEmailPayload } from '../../../products/viz/data/proofOfInsuranceEmail.payload';
import { VIZ_NOTIFICATION_EMAIL } from '../../../products/viz/data/vizNotificationEmail';
import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import {
  createVizAnnualPayment,
  createVizMonthlyPayment,
} from '../../../products/viz/services/payment.service';
import { emailVizProofOfInsurance } from '../../../products/viz/services/proofOfInsuranceEmail.service';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizFullQuoteResponse } from '../../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

function isVizStripeUnavailable(status: number, message: unknown): boolean {
  return (
    (status === 500 || status === 404) &&
    (message === 'Customer does not exist' || message === 'Unknown Stripe error')
  );
}

async function runVizProofOfInsuranceEmailFlow(
  buildFullQuote: (
    quickQuote: VizQuickQuoteResponse,
  ) => ReturnType<typeof buildVizFullQuotePayload>,
  createPayment: (
    fullQuote: VizFullQuoteResponse,
  ) =>
    | ReturnType<typeof createVizAnnualPayment>
    | Promise<ReturnType<typeof createVizAnnualPayment>>,
): Promise<void> {
  const quickQuoteResponse = await createVizQuickQuoteWithRetry(
    buildVizQuickQuotePayload,
  );

  expectApiStatus(quickQuoteResponse, 201);

  const quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;
  const fullQuoteResponse = await createVizFullQuote(buildFullQuote(quickQuote));

  expectApiStatus(fullQuoteResponse, 201);

  const fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;
  const paymentResponse = await createPayment(fullQuote);

  expect(paymentResponse.status).not.toBe(400);
  expect(paymentResponse.status).not.toBe(401);

  if (isVizStripeUnavailable(paymentResponse.status, paymentResponse.body?.message)) {
    console.warn(
      'Viz proof of insurance email mapping skipped: payment failed because Stripe is unavailable on this environment.',
    );
    return;
  }

  expectApiStatus(paymentResponse, 201);

  const emailPayload = buildVizProofOfInsuranceEmailPayload(fullQuote);

  expect(emailPayload.email).toBe(VIZ_NOTIFICATION_EMAIL);
  expect(emailPayload.policyRequestId).toBe(fullQuote.fullQuote.id);

  const emailResponse = await emailVizProofOfInsurance(emailPayload);

  expect(emailResponse.status).not.toBe(400);
  expect(emailResponse.status).not.toBe(401);
  expectApiStatus(emailResponse, 201);
}

describe('Viz Proof of Insurance Email API', () => {
  it(
    'should email proof of insurance for annual payment',
    async () => {
      await runVizProofOfInsuranceEmailFlow(
        (quickQuote) => buildVizFullQuotePayload(quickQuote),
        async (fullQuote) =>
          createVizAnnualPayment(await buildVizAnnualPaymentPayloadFromFullQuote(fullQuote)),
      );
    },
    300000,
  );

  it(
    'should email proof of insurance for monthly payment',
    async () => {
      await runVizProofOfInsuranceEmailFlow(
        buildVizMonthlyFullQuotePayload,
        async (fullQuote) =>
          createVizMonthlyPayment(
            await buildVizMonthlyPaymentPayloadFromFullQuote(fullQuote),
          ),
      );
    },
    300000,
  );
});
