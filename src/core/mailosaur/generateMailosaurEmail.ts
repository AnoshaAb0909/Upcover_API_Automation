import { env } from '../config/env';

function createUniqueSuffix(): string {
  return `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Builds a unique Mailosaur inbox address for OTP and auth flows.
 * Any local part is accepted on @{serverId}.mailosaur.net.
 */
export function generateMailosaurEmail(prefix = 'motortot'): string {
  const serverId = env.mailosaurServerId;

  if (!serverId) {
    throw new Error(
      'MAILOSAUR_SERVER_ID is required to generate a Mailosaur email address.',
    );
  }

  return `${prefix}+${createUniqueSuffix()}@${serverId}.mailosaur.net`;
}
