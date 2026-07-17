import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  baseUrl: requireEnv('BASE_URL', 'https://dev-api.upcover.com'),
  timeout: Number(process.env.REQUEST_TIMEOUT ?? 30000),
  guestEmail: process.env.GUEST_EMAIL ?? 'qa-automation@upcover.com',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeSecretKeyAnnual: process.env.STRIPE_SECRET_KEY_ANNUAL,
  stripeSecretKeyMonthly: process.env.STRIPE_SECRET_KEY_MONTHLY,
  /** Shared across Coalition, Viz, and future products when Stripe lookup is unavailable. */
  fallbackAnnualPaymentMethodId:
    process.env.FALLBACK_ANNUAL_PAYMENT_METHOD_ID ??
    process.env.COALITION_PAYMENT_METHOD_ID ??
    process.env.VIZ_PAYMENT_METHOD_ID ??
    'pm_1TrLFzKwx1QF7fRZuPc5xTSf',
  fallbackMonthlyPaymentMethodId:
    process.env.FALLBACK_MONTHLY_PAYMENT_METHOD_ID ??
    process.env.COALITION_MONTHLY_PAYMENT_METHOD_ID ??
    process.env.VIZ_MONTHLY_PAYMENT_METHOD_ID ??
    'pm_1TrM5aF2zGZ7yHRLOlccPSVW',
  coalitionQuickQuotePath:
    process.env.COALITION_QUICK_QUOTE_PATH ?? '/coalition/quick-quote',
  coalitionFullQuotePath:
    process.env.COALITION_FULL_QUOTE_PATH ?? '/coalition/full-quote',
  coalitionPaymentsPath:
    process.env.COALITION_PAYMENTS_PATH ?? '/coalition/payments',
  coalitionMonthlyPaymentsPath:
    process.env.COALITION_MONTHLY_PAYMENTS_PATH ?? '/coalition/payments/monthly',
  coalitionCouponId: process.env.COALITION_COUPON_ID ?? 'ec92858ce2',
  coalitionQuoteDocsEmailPath:
    process.env.COALITION_QUOTE_DOCS_EMAIL_PATH ?? '/coalition/quote-docs/email',
  coalitionProofOfInsuranceEmailPath:
    process.env.COALITION_PROOF_OF_INSURANCE_EMAIL_PATH ??
    '/coalition/proof-of-insurance/email',
  quoteDocsTimeout: Number(process.env.QUOTE_DOCS_TIMEOUT ?? 120000),
  vizQuickQuotePath:
    process.env.VIZ_QUICK_QUOTE_PATH ?? '/viz/quick-quote',
  vizFullQuotePath:
    process.env.VIZ_FULL_QUOTE_PATH ?? '/viz/full-quote',
  vizPaymentsPath: process.env.VIZ_PAYMENTS_PATH ?? '/viz/payments',
  vizMonthlyPaymentsPath:
    process.env.VIZ_MONTHLY_PAYMENTS_PATH ?? '/viz/payments/monthly',
  vizQuoteDocsEmailPath:
    process.env.VIZ_QUOTE_DOCS_EMAIL_PATH ?? '/viz/quote-docs/email',
  vizProofOfInsuranceEmailPath:
    process.env.VIZ_PROOF_OF_INSURANCE_EMAIL_PATH ??
    '/viz/proof-of-insurance/email',
};
