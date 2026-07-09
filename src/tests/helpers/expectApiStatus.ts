import type { Response } from 'supertest';

export function expectApiStatus(response: Response, expectedStatus: number): void {
  if (response.status === expectedStatus) {
    return;
  }

  const method = response.request?.method ?? 'POST';
  const path = response.request?.url ?? 'unknown path';

  throw new Error(
    `Expected HTTP ${expectedStatus}, received ${response.status} for ${method} ${path}\n` +
      `Response body: ${JSON.stringify(response.body, null, 2)}`,
  );
}
