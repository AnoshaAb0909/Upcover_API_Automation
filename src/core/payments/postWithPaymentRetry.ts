import type { Response } from 'supertest';

export const PAYMENT_RETRY_DELAY_MS = 10_000;
export const PAYMENT_MAX_ATTEMPTS = 6;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryablePaymentStatus(status: number): boolean {
  return status === 500 || status === 502 || status === 503;
}

export async function postWithPaymentRetry(
  label: string,
  execute: () => Promise<Response>,
): Promise<Response> {
  let response = await execute();

  for (
    let attempt = 1;
    attempt < PAYMENT_MAX_ATTEMPTS && isRetryablePaymentStatus(response.status);
    attempt += 1
  ) {
    console.warn(
      `${label} returned ${response.status} — retry ${attempt}/${PAYMENT_MAX_ATTEMPTS - 1} in ${PAYMENT_RETRY_DELAY_MS}ms`,
    );
    await sleep(PAYMENT_RETRY_DELAY_MS);
    response = await execute();
  }

  return response;
}
