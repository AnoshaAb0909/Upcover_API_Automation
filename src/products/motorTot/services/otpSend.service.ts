import { motorTotApiClient } from '../../../core/client/motorTotApiClient';
import { env } from '../../../core/config/env';
import type { MotorTotOtpSendPayload } from '../types/otpSend.payload.types';
import type { Response } from 'supertest';

export async function sendMotorTotOtp(
  payload: MotorTotOtpSendPayload,
): Promise<Response> {
  return motorTotApiClient.post(env.motorTotOtpSendPath).send(payload);
}
