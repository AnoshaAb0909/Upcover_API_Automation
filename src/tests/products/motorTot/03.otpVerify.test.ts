import { runMotorTotRegisterOtpVerifyFlow } from './motorTotAuthFlow';

describe('MotorTOT AU OTP Verify API', () => {
  it(
    'should verify OTP using the code received in Mailosaur',
    async () => {
      const { register, otpVerify, otpCode } =
        await runMotorTotRegisterOtpVerifyFlow();

      expect(register.payload.email).toMatch(/@.+\.mailosaur\.net$/);
      expect(otpCode).toMatch(/^\d{4,6}$/);
      expect(otpVerify.status).toBe(200);
    },
    120000,
  );
});
