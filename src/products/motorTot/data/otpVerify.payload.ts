import type { MotorTotOtpVerifyPayload } from '../types/otpVerify.payload.types';

export function buildMotorTotOtpVerifyPayload(
  email: string,
  code: string,
  overrides: Partial<MotorTotOtpVerifyPayload> = {},
): MotorTotOtpVerifyPayload {
  return {
    email,
    code,
    ...overrides,
  };
}
