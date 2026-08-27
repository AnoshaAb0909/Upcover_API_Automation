/**
 * Access token from MotorTOT OTP verify — separate from guest login token.
 */
let motorTotAccessToken: string | undefined;

export function getMotorTotAccessToken(): string | undefined {
  return motorTotAccessToken;
}

export function setMotorTotAccessToken(token: string): void {
  motorTotAccessToken = token;
}

export function clearMotorTotAccessToken(): void {
  motorTotAccessToken = undefined;
}

export function requireMotorTotAccessToken(): string {
  if (!motorTotAccessToken) {
    throw new Error(
      'No MotorTOT access token available. Complete OTP verify before authenticated MotorTOT requests.',
    );
  }

  return motorTotAccessToken;
}
