import { ensureGuestAuth } from '../../core/auth/guestLogin';

beforeAll(async () => {
  await ensureGuestAuth();
}, 60000);
