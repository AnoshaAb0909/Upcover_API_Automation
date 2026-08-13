import { ensureGuestAuth } from '../../core/auth/guestLogin';
import { env } from '../../core/config/env';

beforeAll(async () => {
  console.log(
    `Test target: ${env.targetEnvironment} (${env.baseUrl})`,
  );
  await ensureGuestAuth();
}, 60000);
