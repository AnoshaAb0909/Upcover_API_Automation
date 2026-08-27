import { runMotorTotRegisterAndOtpSendFlow } from './motorTotAuthFlow';

describe('MotorTOT AU OTP Send API', () => {
  it('should send OTP to the email used during registration', async () => {
    const { register, otpSend } = await runMotorTotRegisterAndOtpSendFlow();

    expect(register.payload.email).toMatch(/@.+\.mailosaur\.net$/);
    expect(otpSend.status).toBe(200);
  });
});
