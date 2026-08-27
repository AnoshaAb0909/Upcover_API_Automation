import request, { type Response, type Test } from 'supertest';
import { getMotorTotAccessToken } from '../auth/motorTotAuthToken';
import { env } from '../config/env';

function applyMotorTotHeaders(
  req: Test,
  timeout = env.timeout,
  accessToken?: string,
): Test {
  req.set('Content-Type', 'application/json');
  req.set('Accept', 'application/json');
  req.set('Cache-Control', 'no-cache');

  const token = accessToken ?? getMotorTotAccessToken();
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  return req.timeout(timeout);
}

function createPostClient(path: string, timeout = env.timeout) {
  return {
    send(body: string | object, accessToken?: string): Promise<Response> {
      return applyMotorTotHeaders(
        request(env.motorTotBaseUrl).post(path),
        timeout,
        accessToken,
      ).send(body);
    },
  };
}

/** MotorTOT AU APIs use a dedicated base URL and auth flow (register/OTP), not guest login. */
export const motorTotApiClient = {
  get(path: string): Test {
    return applyMotorTotHeaders(request(env.motorTotBaseUrl).get(path));
  },

  post(path: string, timeout = env.timeout) {
    return createPostClient(path, timeout);
  },
};
