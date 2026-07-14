import Stripe from 'stripe';
import {
  getStripeClientForMode,
  resolveStripeSecretKey,
  type StripeBillingMode,
} from './stripeClient';

function resolveDefaultPaymentMethodId(
  customer: Stripe.Customer,
): string | undefined {
  const defaultPaymentMethod = customer.invoice_settings?.default_payment_method;

  if (typeof defaultPaymentMethod === 'string') {
    return defaultPaymentMethod;
  }

  return defaultPaymentMethod?.id;
}

async function findOrCreateCustomer(
  stripe: Stripe,
  email: string,
): Promise<Stripe.Customer> {
  const existingCustomers = await stripe.customers.list({ email, limit: 1 });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  const customer = await stripe.customers.create({ email });
  console.warn(`Created Stripe test customer ${customer.id} for ${email}`);

  return customer;
}

async function attachTestCardPaymentMethod(
  stripe: Stripe,
  customerId: string,
): Promise<string> {
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: { token: 'tok_visa' },
  });

  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customerId,
  });

  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethod.id },
  });

  console.warn(
    `Attached test card ${paymentMethod.id} to Stripe customer ${customerId}`,
  );

  return paymentMethod.id;
}

/**
 * Ensures a Stripe test customer exists for the quote email and has a card
 * payment method attached. No-op when Stripe keys are not configured.
 */
export async function ensureStripeCustomerWithPaymentMethod(
  email: string,
  mode: StripeBillingMode = 'annual',
): Promise<void> {
  if (!email) {
    throw new Error('Client email is required to provision a Stripe customer');
  }

  if (!resolveStripeSecretKey(mode)) {
    return;
  }

  const stripe = getStripeClientForMode(mode);
  if (!stripe) {
    return;
  }

  const customer = await findOrCreateCustomer(stripe, email);

  if (resolveDefaultPaymentMethodId(customer)) {
    return;
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customer.id,
    type: 'card',
    limit: 1,
  });

  const existingPaymentMethod = paymentMethods.data[0];

  if (existingPaymentMethod) {
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: existingPaymentMethod.id },
    });
    return;
  }

  await attachTestCardPaymentMethod(stripe, customer.id);
}
