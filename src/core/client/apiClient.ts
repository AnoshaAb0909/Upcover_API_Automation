import request, { type Response, type Test } from 'supertest';
import { refreshGuestAuth } from '../auth/guestLogin';
import { getAccessToken } from '../auth/authToken';
import { env } from '../config/env';

function applyDefaultHeaders(req: Test, timeout = env.timeout): Test {
  req.set('Content-Type', 'application/json');
  req.set('Accept', '*/*');
  req.set('Cache-Control', 'no-cache');

  const accessToken = getAccessToken();
  if (accessToken) {
    req.set('Authorization', `Bearer ${accessToken}`);
  }

  return req.timeout(timeout);
}

async function sendWithAuthRetry(execute: () => Promise<Response>): Promise<Response> {
  let response = await execute();

  if (response.status === 401) {
    await refreshGuestAuth();
    response = await execute();
  }

  return response;
}

function createPostClient(path: string, timeout = env.timeout) {
  return {
    send(body: unknown): Promise<Response> {
      return sendWithAuthRetry(() =>
        applyDefaultHeaders(request(env.baseUrl).post(path), timeout).send(body),
      );
    },
  };
}

export const apiClient = {
  get(path: string): Test {
    return applyDefaultHeaders(request(env.baseUrl).get(path));
  },

  post(path: string, timeout = env.timeout) {
    return createPostClient(path, timeout);
  },

  put(path: string): Test {
    return applyDefaultHeaders(request(env.baseUrl).put(path));
  },

  patch(path: string): Test {
    return applyDefaultHeaders(request(env.baseUrl).patch(path));
  },

  delete(path: string): Test {
    return applyDefaultHeaders(request(env.baseUrl).delete(path));
  },
};
