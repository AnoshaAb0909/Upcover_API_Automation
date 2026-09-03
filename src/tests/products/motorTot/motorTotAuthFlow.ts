import { fetchOtpFromMailosaur } from '../../../core/mailosaur/fetchOtpFromMailosaur';
import { buildMotorTotFullQuotePayload } from '../../../products/motorTot/data/fullQuote.payload';
import { buildMotorTotQuickQuotePayload } from '../../../products/motorTot/data/quickQuote.payload';
import { extractMotorTotAccessToken } from '../../../products/motorTot/helpers/extractMotorTotAccessToken';
import { buildMotorTotOtpVerifyPayload } from '../../../products/motorTot/data/otpVerify.payload';
import { createMotorTotFullQuote } from '../../../products/motorTot/services/fullQuote.service';
import { createMotorTotQuickQuote } from '../../../products/motorTot/services/quickQuote.service';
import { verifyMotorTotOtp } from '../../../products/motorTot/services/otpVerify.service';
import type { MotorTotFullQuotePayload } from '../../../products/motorTot/types/fullQuote.payload.types';
import type { MotorTotQuickQuotePayload } from '../../../products/motorTot/types/quickQuote.payload.types';
import type { MotorTotQuickQuoteResponse } from '../../../products/motorTot/types/quickQuote.response.types';
import type { MotorTotRegisterPayload } from '../../../products/motorTot/types/register.payload.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';
import type { Response } from 'supertest';
import { buildMotorTotOtpSendPayload } from '../../../products/motorTot/data/otpSend.payload';
import { buildMotorTotRegisterPayload } from '../../../products/motorTot/data/register.payload';
import { sendMotorTotOtp } from '../../../products/motorTot/services/otpSend.service';
import { registerMotorTotClient } from '../../../products/motorTot/services/register.service';

export interface MotorTotRegisterContext {
  payload: MotorTotRegisterPayload;
  response: Response;
}

export async function runMotorTotRegisterStep(
  overrides: Partial<MotorTotRegisterPayload> = {},
): Promise<MotorTotRegisterContext> {
  const payload = buildMotorTotRegisterPayload(overrides);
  const response = await registerMotorTotClient(payload);

  expectApiStatus(response, 200);

  return { payload, response };
}

export async function runMotorTotOtpSendStep(email: string): Promise<Response> {
  const payload = buildMotorTotOtpSendPayload(email);
  const response = await sendMotorTotOtp(payload);

  expectApiStatus(response, 200);

  return response;
}

export async function runMotorTotOtpVerifyStep(
  email: string,
  options: { code?: string; receivedAfter?: Date; maxAttempts?: number } = {},
): Promise<{ response: Response; code: string }> {
  const maxAttempts = options.maxAttempts ?? 2;
  let lastResponse: Response | undefined;
  let lastCode = '';

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const otpCode =
      options.code ??
      (await fetchOtpFromMailosaur(email, {
        receivedAfter: options.receivedAfter,
      }));
    lastCode = otpCode;
    const payload = buildMotorTotOtpVerifyPayload(email, otpCode);
    lastResponse = await verifyMotorTotOtp(payload);

    if (lastResponse.status === 200) {
      return { response: lastResponse, code: otpCode };
    }

    if (attempt < maxAttempts && lastResponse.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      continue;
    }

    break;
  }

  expectApiStatus(lastResponse!, 200);

  return { response: lastResponse!, code: lastCode };
}

/**
 * Register a motor client, then request an OTP for the same Mailosaur email.
 */
export async function runMotorTotRegisterAndOtpSendFlow(
  overrides: Partial<MotorTotRegisterPayload> = {},
): Promise<{ register: MotorTotRegisterContext; otpSend: Response }> {
  const register = await runMotorTotRegisterStep(overrides);
  const otpSend = await runMotorTotOtpSendStep(register.payload.email);

  return { register, otpSend };
}

/**
 * Register → send OTP → read OTP from Mailosaur → verify OTP.
 */
export async function runMotorTotRegisterOtpVerifyFlow(
  overrides: Partial<MotorTotRegisterPayload> = {},
): Promise<{
  register: MotorTotRegisterContext;
  otpSend: Response;
  otpVerify: Response;
  otpCode: string;
}> {
  const register = await runMotorTotRegisterStep(overrides);
  const email = register.payload.email;
  const otpSend = await runMotorTotOtpSendStep(email);
  const otpRequestedAt = new Date();
  const { response: otpVerify, code: otpCode } = await runMotorTotOtpVerifyStep(
    email,
    { receivedAfter: otpRequestedAt },
  );

  return { register, otpSend, otpVerify, otpCode };
}

/**
 * Register → OTP verify → extract Bearer token for authenticated MotorTOT calls.
 */
export async function runMotorTotAuthFlow(
  overrides: Partial<MotorTotRegisterPayload> = {},
): Promise<{
  register: MotorTotRegisterContext;
  otpSend: Response;
  otpVerify: Response;
  otpCode: string;
  accessToken: string;
}> {
  const auth = await runMotorTotRegisterOtpVerifyFlow(overrides);
  const accessToken = extractMotorTotAccessToken(auth.otpVerify);

  return { ...auth, accessToken };
}

/**
 * Authenticate via OTP, then create a quick quote with the Bearer token.
 */
export async function runMotorTotQuickQuoteFlow(
  quickQuoteOverrides: Partial<MotorTotQuickQuotePayload> = {},
  registerOverrides: Partial<MotorTotRegisterPayload> = {},
): Promise<{
  register: MotorTotRegisterContext;
  accessToken: string;
  quickQuotePayload: MotorTotQuickQuotePayload;
  quickQuote: Response;
}> {
  const { register, accessToken } = await runMotorTotAuthFlow(registerOverrides);
  const quickQuotePayload = buildMotorTotQuickQuotePayload({
    ...quickQuoteOverrides,
    clientInformation: {
      ...quickQuoteOverrides.clientInformation,
      email: register.payload.email,
    },
  });
  const quickQuote = await createMotorTotQuickQuote(quickQuotePayload);

  return { register, accessToken, quickQuotePayload, quickQuote };
}

/**
 * Authenticate → quick quote → full quote using the QQ `id` as `quoteId`.
 */
export async function runMotorTotFullQuoteFlow(
  fullQuoteOverrides: Partial<MotorTotFullQuotePayload> = {},
  quickQuoteOverrides: Partial<MotorTotQuickQuotePayload> = {},
  registerOverrides: Partial<MotorTotRegisterPayload> = {},
): Promise<{
  register: MotorTotRegisterContext;
  accessToken: string;
  quickQuotePayload: MotorTotQuickQuotePayload;
  quickQuote: Response;
  quickQuoteId: string;
  fullQuotePayload: MotorTotFullQuotePayload;
  fullQuote: Response;
}> {
  const { register, accessToken, quickQuotePayload, quickQuote } =
    await runMotorTotQuickQuoteFlow(quickQuoteOverrides, registerOverrides);

  expectApiStatus(quickQuote, 201);

  const quickQuoteBody = quickQuote.body as MotorTotQuickQuoteResponse;
  expect(quickQuoteBody.status).toBe('indicative-quote-generated');

  const quickQuoteId = quickQuoteBody.id;
  const fullQuotePayload = buildMotorTotFullQuotePayload(
    quickQuoteId,
    fullQuoteOverrides,
  );
  const fullQuote = await createMotorTotFullQuote(fullQuotePayload);

  return {
    register,
    accessToken,
    quickQuotePayload,
    quickQuote,
    quickQuoteId,
    fullQuotePayload,
    fullQuote,
  };
}
