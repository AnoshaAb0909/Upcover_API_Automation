import request, { type Test } from 'supertest';
import { getAccessToken } from '../auth/authToken';
import { env } from '../config/env';

function applyDefaultHeaders(req: Test, timeout = env.timeout): Test {
  req.set('Content-Type', 'application/json');
  req.set('Accept', 'application/json');

  const accessToken = getAccessToken();
  if (accessToken) {
    req.set('Authorization', `Bearer ${accessToken}`);
  }

  return req.timeout(timeout);
}

export const apiClient = {
  get(path: string): Test {
    return applyDefaultHeaders(request(env.baseUrl).get(path));
  },

  post(path: string, timeout = env.timeout): Test {
    return applyDefaultHeaders(request(env.baseUrl).post(path), timeout);
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
