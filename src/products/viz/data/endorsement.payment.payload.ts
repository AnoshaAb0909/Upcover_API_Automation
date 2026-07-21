import { resolveSharedPaymentMethodId } from '../../../core/payments';
import type {
  VizEndorsementMonthlyPaymentPayload,
  VizEndorsementResponse,
} from '../types/endorsement.payload.types';

export function resolveVizEndorsementQuoteId(
  endorsement: VizEndorsementResponse,
): string {
  const quoteId = endorsement.fullQuote?.id;

  if (!quoteId) {
    throw new Error('Endorsement response is missing fullQuote.id');
  }

  return quoteId;
}

export function resolveVizEndorsementClientPayable(
  endorsement: VizEndorsementResponse,
): number {
  const clientPayable = endorsement.fullQuote?.priceBreakdown.clientPayable;

  if (clientPayable === undefined) {
    throw new Error(
      'Endorsement response is missing fullQuote.priceBreakdown.clientPayable',
    );
  }

  return clientPayable;
}

export function mapVizEndorsementResponseToMonthlyPaymentPayload(
  endorsement: VizEndorsementResponse,
  overrides: Partial<VizEndorsementMonthlyPaymentPayload> = {},
): VizEndorsementMonthlyPaymentPayload {
  return {
    quoteId: resolveVizEndorsementQuoteId(endorsement),
    paymentMethodId: '',
    expectedPrice: resolveVizEndorsementClientPayable(endorsement),
    ...overrides,
  };
}

export async function buildVizEndorsementMonthlyPaymentPayload(
  endorsement: VizEndorsementResponse,
  overrides: Partial<VizEndorsementMonthlyPaymentPayload> = {},
): Promise<VizEndorsementMonthlyPaymentPayload> {
  const email = endorsement.fullQuote?.req.clientInformation.email;

  if (!email) {
    throw new Error(
      'Endorsement response is missing fullQuote.req.clientInformation.email',
    );
  }

  const paymentMethodId = await resolveSharedPaymentMethodId(email, 'monthly');

  return mapVizEndorsementResponseToMonthlyPaymentPayload(endorsement, {
    paymentMethodId,
    ...overrides,
  });
}
