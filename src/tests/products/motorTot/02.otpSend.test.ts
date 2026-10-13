import { runMotorTotRegisterAndOtpSendFlow } from './motorTotAuthFlow';

describe('MotorTOT AU OTP Send API', () => {
  it('should send OTP to the reused motor-rm Mailosaur email', async () => {
    const { register, otpSend } = await runMotorTotRegisterAndOtpSendFlow();

    expect(register.payload.email).toMatch(/@.+\.mailosaur\.net$/);
    expect(otpSend.status).toBe(200);
  });
});
