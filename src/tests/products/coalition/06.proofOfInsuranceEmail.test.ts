import { buildFullQuotePayload, buildMonthlyFullQuotePayload } from '../../../products/coalition/data/fullQuote.payload';
import {
  buildAnnualPaymentPayload,
  buildMonthlyPaymentPayload,
} from '../../../products/coalition/data/payment.payload';
import { buildProofOfInsuranceEmailPayload } from '../../../products/coalition/data/proofOfInsuranceEmail.payload';
import { buildQuickQuotePayload } from '../../../products/coalition/data/quickQuote.payload';
import { createFullQuote } from '../../../products/coalition/services/fullQuote.service';
import {
  createAnnualPayment,
  createMonthlyPayment,
} from '../../../products/coalition/services/payment.service';
import { emailProofOfInsurance } from '../../../products/coalition/services/proofOfInsuranceEmail.service';
import { createQuickQuoteWithRetry } from '../../../products/coalition/services/quickQuote.service';
import type { FullQuoteResponse } from '../../../products/coalition/types/fullQuote.types';
import type { PaymentResponse } from '../../../products/coalition/types/payment.types';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

function isMissingStripeCustomer(status: number, message: unknown): boolean {
  return (
    (status === 500 || status === 404) && message === 'Customer does not exist'
  );
}

async function runProofOfInsuranceEmailFlow(
  buildFullQuote: (quickQuote: QuickQuoteResponse) => ReturnType<typeof buildFullQuotePayload>,
  createPayment: (
    fullQuote: FullQuoteResponse,
  ) => ReturnType<typeof createAnnualPayment>,
): Promise<void> {
  const quickQuoteResponse = await createQuickQuoteWithRetry(buildQuickQuotePayload);

  expectApiStatus(quickQuoteResponse, 201);

  const quickQuote = quickQuoteResponse.body as QuickQuoteResponse;
  const fullQuoteResponse = await createFullQuote(buildFullQuote(quickQuote));

  expectApiStatus(fullQuoteResponse, 201);

  const fullQuote = fullQuoteResponse.body as FullQuoteResponse;
  const paymentResponse = await createPayment(fullQuote);

  expect(paymentResponse.status).not.toBe(400);
  expect(paymentResponse.status).not.toBe(401);

  if (isMissingStripeCustomer(paymentResponse.status, paymentResponse.body?.message)) {
    console.warn(
      'Proof of insurance email mapping skipped: payment failed because Stripe customer is missing on this environment.',
    );
    return;
  }

  expectApiStatus(paymentResponse, 201);

  const payment = paymentResponse.body as PaymentResponse;
  const emailPayload = buildProofOfInsuranceEmailPayload(fullQuote, payment);

  expect(emailPayload.email).toBe(fullQuote.fullQuote.req.clientInformation.email);
  expect(emailPayload.policyRequestId).toBe(payment.id);

  const emailResponse = await emailProofOfInsurance(emailPayload);

  expect(emailResponse.status).not.toBe(400);
  expect(emailResponse.status).not.toBe(401);
  expectApiStatus(emailResponse, 200);
}

describe('Coalition Proof of Insurance Email API', () => {
  it(
    'should email proof of insurance for annual payment',
    async () => {
      await runProofOfInsuranceEmailFlow(
        (quickQuote) =>
          buildFullQuotePayload(quickQuote, { isMonthlySubscription: false }),
        (fullQuote) => createAnnualPayment(buildAnnualPaymentPayload(fullQuote)),
      );
    },
    300000,
  );

  it(
    'should email proof of insurance for monthly payment',
    async () => {
      await runProofOfInsuranceEmailFlow(buildMonthlyFullQuotePayload, (fullQuote) =>
        createMonthlyPayment(buildMonthlyPaymentPayload(fullQuote)),
      );
    },
    300000,
  );
});
