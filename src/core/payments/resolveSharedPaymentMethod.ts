import { env } from '../config/env';
import {
  ensureStripeCustomerWithPaymentMethod,
  resolvePaymentMethodIdForEmail,
} from '../stripe';

export type PaymentBillingMode = 'annual' | 'monthly';

function fallbackPaymentMethodId(mode: PaymentBillingMode): string {
  return mode === 'annual'
    ? env.fallbackAnnualPaymentMethodId
    : env.fallbackMonthlyPaymentMethodId;
}

/**
 * Provisions a Stripe test customer/card for the quote email when needed, then
 * resolves the payment method ID for any product using shared platform keys.
 */
export async function resolveSharedPaymentMethodId(
  clientEmail: string,
  mode: PaymentBillingMode,
): Promise<string> {
  await ensureStripeCustomerWithPaymentMethod(clientEmail, mode);

  return resolvePaymentMethodIdForEmail(
    clientEmail,
    fallbackPaymentMethodId(mode),
    mode,
  );
}
