export function isAhpStripeUnavailable(
  status: number,
  message: unknown,
): boolean {
  return (
    (status === 500 || status === 404) &&
    (message === 'Customer does not exist' || message === 'Unknown Stripe error')
  );
}

export function isAhpQuoteAlreadyIssued(
  status: number,
  message: unknown,
): boolean {
  return (
    (status === 400 || status === 500) &&
    String(message ?? '').includes('PolicyIssued')
  );
}
