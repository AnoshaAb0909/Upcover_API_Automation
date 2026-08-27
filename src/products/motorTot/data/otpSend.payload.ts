import type { MotorTotOtpSendPayload } from '../types/otpSend.payload.types';

export function buildMotorTotOtpSendPayload(
  email: string,
  overrides: Partial<MotorTotOtpSendPayload> = {},
): MotorTotOtpSendPayload {
  return {
    email,
    ...overrides,
  };
}
