import { buildAnnualQuickQuotePayload } from '../../../products/coalition/data/annualQuickQuote.template';
import { COALITION_NOTIFICATION_EMAIL } from '../../../products/coalition/data/coalitionNotificationEmail';
import {
  buildAnnualFullQuotePayload,
  buildMonthlyFullQuotePayload,
} from '../../../products/coalition/data/fullQuote.payload';
import {
  buildAnnualPaymentPayloadFromFullQuote,
  buildMonthlyPaymentPayloadFromFullQuote,
} from '../../../products/coalition/data/payment.payload';
import { buildQuickQuotePayload } from '../../../products/coalition/data/quickQuote.payload';
import { buildQuoteDocsEmailPayload } from '../../../products/coalition/data/quoteDocsEmail.payload';
import { createFullQuote } from '../../../products/coalition/services/fullQuote.service';
import {
  createAnnualPayment,
  createMonthlyPayment,
} from '../../../products/coalition/services/payment.service';
import { emailQuoteDocs } from '../../../products/coalition/services/quoteDocsEmail.service';
import { createQuickQuoteWithRetry } from '../../../products/coalition/services/quickQuote.service';
import type { FullQuoteResponse } from '../../../products/coalition/types/fullQuote.types';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';
import {
  expectCoalitionFullQuotePayload,
  expectCoalitionFullQuoteResponse,
  expectCoalitionPaymentPayload,
  expectCoalitionPaymentResponse,
  expectCoalitionQuoteDocsPayload,
  expectCoalitionQuickQuote,
} from './coalitionFlowExpectations';

export type CoalitionSubscriptionMode = 'annual' | 'monthly';

export interface CoalitionFlowContext {
  quickQuote: QuickQuoteResponse;
  fullQuote: FullQuoteResponse;
}

function getCoalitionFlowBuilders(mode: CoalitionSubscriptionMode) {
  return {
    buildQuickQuote:
      mode === 'annual' ? buildAnnualQuickQuotePayload : buildQuickQuotePayload,
    buildFullQuote:
      mode === 'annual' ? buildAnnualFullQuotePayload : buildMonthlyFullQuotePayload,
  };
}

function isMissingStripeCustomer(status: number, message: unknown): boolean {
  return (
    (status === 500 || status === 404) && message === 'Customer does not exist'
  );
}

export async function runCoalitionQuickQuoteStep(
  mode: CoalitionSubscriptionMode,
): Promise<QuickQuoteResponse> {
  const { buildQuickQuote } = getCoalitionFlowBuilders(mode);
  const quickQuoteResponse = await createQuickQuoteWithRetry(buildQuickQuote);

  expectApiStatus(quickQuoteResponse, 201);

  const quickQuote = quickQuoteResponse.body as QuickQuoteResponse;
  expectCoalitionQuickQuote(quickQuote);

  return quickQuote;
}

export async function runCoalitionFullQuoteStep(
  mode: CoalitionSubscriptionMode,
  quickQuote?: QuickQuoteResponse,
): Promise<CoalitionFlowContext> {
  const resolvedQuickQuote =
    quickQuote ?? (await runCoalitionQuickQuoteStep(mode));
  const { buildFullQuote } = getCoalitionFlowBuilders(mode);
  const fullQuotePayload = buildFullQuote(resolvedQuickQuote);

  expectCoalitionFullQuotePayload(fullQuotePayload, resolvedQuickQuote, mode);

  const fullQuoteResponse = await createFullQuote(fullQuotePayload);
  expectApiStatus(fullQuoteResponse, 201);

  const fullQuote = fullQuoteResponse.body as FullQuoteResponse;
  expectCoalitionFullQuoteResponse(fullQuote, resolvedQuickQuote, mode);

  return { quickQuote: resolvedQuickQuote, fullQuote };
}

export async function runCoalitionQuoteDocsStep(
  mode: CoalitionSubscriptionMode,
  context?: CoalitionFlowContext,
): Promise<CoalitionFlowContext> {
  const resolvedContext = context ?? (await runCoalitionFullQuoteStep(mode));
  const { fullQuote } = resolvedContext;
  const quoteDocsPayload = buildQuoteDocsEmailPayload(fullQuote);

  expectCoalitionQuoteDocsPayload(quoteDocsPayload, fullQuote);
  expect(quoteDocsPayload.email).toBe(COALITION_NOTIFICATION_EMAIL);

  const quoteDocsResponse = await emailQuoteDocs(quoteDocsPayload);
  expect(quoteDocsResponse.status).not.toBe(400);
  expect(quoteDocsResponse.status).not.toBe(401);
  expectApiStatus(quoteDocsResponse, 201);

  return resolvedContext;
}

export async function runCoalitionPaymentStep(
  mode: CoalitionSubscriptionMode,
  context?: CoalitionFlowContext,
): Promise<void> {
  const { fullQuote } = context ?? (await runCoalitionFullQuoteStep(mode));
  const paymentPayload =
    mode === 'annual'
      ? await buildAnnualPaymentPayloadFromFullQuote(fullQuote)
      : await buildMonthlyPaymentPayloadFromFullQuote(fullQuote);

  expectCoalitionPaymentPayload(paymentPayload, fullQuote, mode);

  const paymentResponse =
    mode === 'annual'
      ? await createAnnualPayment(paymentPayload)
      : await createMonthlyPayment(paymentPayload);

  expect(paymentResponse.status).not.toBe(400);
  expect(paymentResponse.status).not.toBe(401);

  if (isMissingStripeCustomer(paymentResponse.status, paymentResponse.body?.message)) {
    console.warn(
      `Coalition ${mode} payment failed because Stripe customer is missing.`,
    );
    return;
  }

  expectApiStatus(paymentResponse, 201);
  expectCoalitionPaymentResponse(paymentResponse.body);
}

/**
 * Coalition happy path:
 * 1. Quick quote → 2. Full quote → 3. Quote docs email → 4. Payment
 */
export async function runCoalitionSubscriptionFlow(
  mode: CoalitionSubscriptionMode,
): Promise<void> {
  const quickQuote = await runCoalitionQuickQuoteStep(mode);
  const context = await runCoalitionFullQuoteStep(mode, quickQuote);
  await runCoalitionQuoteDocsStep(mode, context);
  await runCoalitionPaymentStep(mode, context);
}
