import { motorTotApiClient } from '../../../core/client/motorTotApiClient';
import { env } from '../../../core/config/env';
import type { MotorTotRegisterPayload } from '../types/register.payload.types';
import type { Response } from 'supertest';

export async function registerMotorTotClient(
  payload: MotorTotRegisterPayload,
): Promise<Response> {
  return motorTotApiClient.post(env.motorTotRegisterPath).send(payload);
}
