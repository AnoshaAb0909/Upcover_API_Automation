import request from 'supertest';
import { env } from '../config/env';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './authToken';

interface GuestLoginResponse {
  accessToken: string;
  createdOn?: string;
}

/**
 * GET /auth/guestLogin
 * Fetches a guest access token and stores it in the central auth store.
 * Shared by all products (Coalition, AHP, Viz).
 */
export async function ensureGuestAuth(): Promise<string> {
  const existingToken = getAccessToken();
  if (existingToken) {
    return existingToken;
  }

  const response = await request(env.baseUrl)
    .get('/auth/guestLogin')
    .set('Accept', 'application/json')
    .expect(200);

  const body = response.body as GuestLoginResponse;

  if (!body.accessToken) {
    throw new Error('Guest login did not return an accessToken');
  }

  setAccessToken(body.accessToken);
  return body.accessToken;
}

export async function getGuestToken(): Promise<string> {
  return ensureGuestAuth();
}

export function clearGuestAuth(): void {
  clearAccessToken();
}
