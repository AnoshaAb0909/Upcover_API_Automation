import request from 'supertest';
import { clearGuestAuth, ensureGuestAuth } from '../../core/auth/guestLogin';
import { getAccessToken, setAccessToken } from '../../core/auth/authToken';
import { env } from '../../core/config/env';

describe('Guest Login API', () => {
  beforeEach(() => {
    clearGuestAuth();
  });

  it('GET /auth/guestLogin should return an accessToken', async () => {
    const response = await request(env.baseUrl)
      .get('/auth/guestLogin')
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
    expect(response.body.accessToken.length).toBeGreaterThan(0);
  });

  it('should store accessToken in the central auth store', async () => {
    const token = await ensureGuestAuth();

    expect(token).toBeDefined();
    expect(getAccessToken()).toBe(token);
  });

  it('should reuse cached accessToken without calling login again', async () => {
    const firstToken = await ensureGuestAuth();
    setAccessToken(firstToken);

    const secondToken = await ensureGuestAuth();
    expect(secondToken).toBe(firstToken);
  });
});
