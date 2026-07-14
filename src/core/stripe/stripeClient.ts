import Stripe from 'stripe';
import { env } from '../config/env';

const stripeClients = new Map<string, Stripe>();

export type StripeBillingMode = 'annual' | 'monthly';

export function resolveStripeSecretKey(mode: StripeBillingMode): string | undefined {
  if (mode === 'annual') {
    return env.stripeSecretKeyAnnual ?? env.stripeSecretKey;
  }

  return env.stripeSecretKeyMonthly ?? env.stripeSecretKey;
}

export function getStripeClient(secretKey: string): Stripe {
  if (!secretKey) {
    throw new Error('A Stripe secret key is required');
  }

  let client = stripeClients.get(secretKey);
  if (!client) {
    client = new Stripe(secretKey);
    stripeClients.set(secretKey, client);
  }

  return client;
}

export function getStripeClientForMode(mode: StripeBillingMode): Stripe | undefined {
  const secretKey = resolveStripeSecretKey(mode);
  if (!secretKey) {
    return undefined;
  }

  return getStripeClient(secretKey);
}
