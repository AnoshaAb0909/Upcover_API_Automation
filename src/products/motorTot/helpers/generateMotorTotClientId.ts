import { randomBytes } from 'crypto';

const CLIENT_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Generates a MotorTOT client id in the form `UPC-XXXXXX`. */
export function generateMotorTotClientId(): string {
  const bytes = randomBytes(6);
  let suffix = '';

  for (let index = 0; index < 6; index += 1) {
    suffix += CLIENT_ID_CHARS[bytes[index] % CLIENT_ID_CHARS.length];
  }

  return `UPC-${suffix}`;
}
