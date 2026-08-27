import { motorTotApiClient } from '../../../core/client/motorTotApiClient';
import { env } from '../../../core/config/env';
import type { MotorTotOtpVerifyPayload } from '../types/otpVerify.payload.types';
import type { Response } from 'supertest';

export async function verifyMotorTotOtp(
  payload: MotorTotOtpVerifyPayload,
): Promise<Response> {
  return motorTotApiClient.post(env.motorTotOtpVerifyPath).send(payload);
}
