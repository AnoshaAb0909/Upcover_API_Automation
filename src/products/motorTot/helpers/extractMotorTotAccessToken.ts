import { setMotorTotAccessToken } from '../../../core/auth/motorTotAuthToken';
import type { MotorTotOtpVerifyResponse } from '../types/otpVerify.response.types';
import type { Response } from 'supertest';

export function extractMotorTotAccessToken(response: Response): string {
  const body = response.body as MotorTotOtpVerifyResponse;

  if (!body?.access_token) {
    throw new Error(
      'MotorTOT OTP verify response did not include an access_token.',
    );
  }

  setMotorTotAccessToken(body.access_token);

  return body.access_token;
}
