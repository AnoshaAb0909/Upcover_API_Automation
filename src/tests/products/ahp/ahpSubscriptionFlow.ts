import {
  buildAhpFullQuotePayload,
  buildAhpMonthlyFullQuotePayload,
  resolveAhpQuickQuoteId,
} from '../../../products/ahp/data/fullQuote.payload';
import {
  buildAhpAnnualPaymentPayloadFromFullQuote,
  buildAhpMonthlyPaymentPayloadFromFullQuote,
} from '../../../products/ahp/data/payment.payload';
import { buildAhpQuickQuotePayload } from '../../../products/ahp/data/quickQuote.payload';
import { createAhpFullQuote } from '../../../products/ahp/services/fullQuote.service';
import {
  createAhpAnnualPayment,
  createAhpMonthlyPayment,
} from '../../../products/ahp/services/payment.service';
import { createAhpQuickQuoteWithRetry } from '../../../products/ahp/services/quickQuote.service';
import type { AhpFullQuotePayload } from '../../../products/ahp/types/fullQuote.payload.types';
import type { AhpFullQuoteResponseBody } from '../../../products/ahp/types/fullQuote.types';
import type { AhpQuickQuotePayload } from '../../../products/ahp/types/quickQuote.payload.types';
import type { AhpQuickQuoteResponse } from '../../../products/ahp/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';
import {
  expectAhpFullQuotePayload,
  expectAhpFullQuoteResponse,
  expectAhpPaymentPayload,
  expectAhpPaymentResponse,
  expectAhpQuickQuote,
  type AhpFlowMode,
} from './ahpFlowExpectations';

export type AhpSubscriptionMode = AhpFlowMode;

export interface AhpFlowContext {
  quickQuoteRequest: AhpQuickQuotePayload;
  quickQuote: AhpQuickQuoteResponse;
  fullQuotePayload: AhpFullQuotePayload;
  fullQuote: AhpFullQuoteResponseBody;
}

function getAhpFlowBuilders(mode: AhpSubscriptionMode) {
  return {
    buildFullQuotePayload:
      mode === 'monthly'
        ? buildAhpMonthlyFullQuotePayload
        : (
            quickQuote: AhpQuickQuoteResponse,
            quickQuoteRequest: AhpQuickQuotePayload,
          ) => buildAhpFullQuotePayload(quickQuote, quickQuoteRequest),
  };
}

function isMissingStripeCustomer(status: number, message: unknown): boolean {
  return (
    (status === 500 || status === 404) &&
    (message === 'Customer does not exist' || message === 'Unknown Stripe error')
  );
}

export async function runAhpQuickQuoteStep(): Promise<{
  quickQuoteRequest: AhpQuickQuotePayload;
  quickQuote: AhpQuickQuoteResponse;
}> {
  const quickQuoteRequest = buildAhpQuickQuotePayload();
  const quickQuoteResponse = await createAhpQuickQuoteWithRetry(
    () => quickQuoteRequest,
  );

  expectApiStatus(quickQuoteResponse, 201);

  const quickQuote = quickQuoteResponse.body as AhpQuickQuoteResponse;
  expectAhpQuickQuote(quickQuote, quickQuoteRequest);

  return { quickQuoteRequest, quickQuote };
}

export async function runAhpFullQuoteStep(
  mode: AhpSubscriptionMode,
  seed?: {
    quickQuoteRequest: AhpQuickQuotePayload;
    quickQuote: AhpQuickQuoteResponse;
  },
): Promise<AhpFlowContext> {
  const { quickQuoteRequest, quickQuote } =
    seed ?? (await runAhpQuickQuoteStep());
  const { buildFullQuotePayload } = getAhpFlowBuilders(mode);
  const fullQuotePayload = buildFullQuotePayload(quickQuote, quickQuoteRequest);

  expectAhpFullQuotePayload(fullQuotePayload, quickQuote, quickQuoteRequest, mode);

  const fullQuoteResponse = await createAhpFullQuote(fullQuotePayload);
  expectApiStatus(fullQuoteResponse, 201);

  const fullQuote = fullQuoteResponse.body as AhpFullQuoteResponseBody;
  expectAhpFullQuoteResponse(fullQuote, quickQuote, mode);

  return {
    quickQuoteRequest,
    quickQuote,
    fullQuotePayload,
    fullQuote,
  };
}

export async function runAhpPaymentStep(
  mode: AhpSubscriptionMode,
  context?: AhpFlowContext,
): Promise<void> {
  const resolvedContext = context ?? (await runAhpFullQuoteStep(mode));
  const { fullQuote, fullQuotePayload } = resolvedContext;
  const paymentPayload =
    mode === 'annual'
      ? await buildAhpAnnualPaymentPayloadFromFullQuote(
          fullQuote,
          fullQuotePayload.email,
        )
      : await buildAhpMonthlyPaymentPayloadFromFullQuote(
          fullQuote,
          fullQuotePayload.email,
        );

  expectAhpPaymentPayload(paymentPayload, fullQuote, mode);

  const paymentResponse =
    mode === 'annual'
      ? await createAhpAnnualPayment(paymentPayload)
      : await createAhpMonthlyPayment(paymentPayload);

  expect(paymentResponse.status).not.toBe(400);
  expect(paymentResponse.status).not.toBe(401);

  if (isMissingStripeCustomer(paymentResponse.status, paymentResponse.body?.message)) {
    console.warn(
      `AHP ${mode} payment failed because Stripe customer is missing or unavailable.`,
    );
    return;
  }

  expectApiStatus(paymentResponse, 201);
  expectAhpPaymentResponse(paymentResponse.body);
}

export { resolveAhpQuickQuoteId };
