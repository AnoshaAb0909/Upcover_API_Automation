import {
  getStripeClientForMode,
  resolveStripeSecretKey,
  type StripeBillingMode,
} from './stripeClient';

/**
 * Looks up the Stripe customer's default card payment method by client email.
 * Falls back to the provided payment method ID when no Stripe key is configured
 * or when the customer / card cannot be resolved for the quote email.
 */
export async function resolvePaymentMethodIdForEmail(
  email: string,
  fallbackPaymentMethodId: string,
  mode: StripeBillingMode = 'annual',
): Promise<string> {
  if (!email) {
    throw new Error('Client email is required to resolve a Stripe payment method');
  }

  const stripeSecretKey = resolveStripeSecretKey(mode);

  if (!stripeSecretKey) {
    console.warn(
      `Stripe secret key not set for ${mode} payments — using fallback payment method for ${email}`,
    );
    return fallbackPaymentMethodId;
  }

  const stripe = getStripeClientForMode(mode);
  if (!stripe) {
    return fallbackPaymentMethodId;
  }

  const customers = await stripe.customers.list({ email, limit: 1 });

  if (customers.data.length === 0) {
    console.warn(
      `No Stripe customer found for ${email} (${mode}) — using fallback payment method`,
    );
    return fallbackPaymentMethodId;
  }

  const customer = customers.data[0];
  const defaultPaymentMethodId =
    typeof customer.invoice_settings?.default_payment_method === 'string'
      ? customer.invoice_settings.default_payment_method
      : customer.invoice_settings?.default_payment_method?.id;

  if (defaultPaymentMethodId) {
    return defaultPaymentMethodId;
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customer.id,
    type: 'card',
    limit: 1,
  });

  const paymentMethod = paymentMethods.data[0];

  if (!paymentMethod) {
    console.warn(
      `No Stripe card payment method found for customer ${customer.id} (${email}, ${mode}) — using fallback payment method`,
    );
    return fallbackPaymentMethodId;
  }

  return paymentMethod.id;
}
