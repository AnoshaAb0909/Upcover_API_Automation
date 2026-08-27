import { env } from '../config/env';

const MAILOSAUR_API_BASE = 'https://mailosaur.com/api';

interface MailosaurMessageSummary {
  id: string;
  subject?: string;
  received?: string;
}

interface MailosaurMessageList {
  items?: MailosaurMessageSummary[];
}

interface MailosaurMessageBody {
  subject?: string;
  html?: { body?: string };
  text?: { body?: string };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requireMailosaurConfig(): { apiKey: string; serverId: string } {
  const apiKey = env.mailosaurApiKey;
  const serverId = env.mailosaurServerId;

  if (!apiKey) {
    throw new Error('MAILOSAUR_API_KEY is required to read OTP emails.');
  }

  if (!serverId) {
    throw new Error('MAILOSAUR_SERVER_ID is required to read OTP emails.');
  }

  return { apiKey, serverId };
}

async function mailosaurGet<T>(path: string): Promise<T> {
  const { apiKey } = requireMailosaurConfig();
  const authorization = Buffer.from(`${apiKey}:`).toString('base64');
  const response = await fetch(`${MAILOSAUR_API_BASE}${path}`, {
    headers: {
      Authorization: `Basic ${authorization}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Mailosaur API ${response.status} for GET ${path}: ${body}`,
    );
  }

  return response.json() as Promise<T>;
}

function extractOtpFromText(text: string): string | undefined {
  const normalized = text.replace(/\s+/g, ' ');

  const accessCodeMatch = normalized.match(/access code:\s*(\d{4,6})/i);
  if (accessCodeMatch?.[1]) {
    return accessCodeMatch[1];
  }

  const labeledMatch = normalized.match(
    /(?:otp|passcode|verification code)[^0-9]{0,20}(\d{4,6})/i,
  );
  if (labeledMatch?.[1]) {
    return labeledMatch[1];
  }

  const standaloneMatch = normalized.match(/\b(\d{4,6})\b/);
  return standaloneMatch?.[1];
}

function extractOtpFromMessage(message: MailosaurMessageBody): string {
  const textBody = message.text?.body ?? '';
  const otpFromText = extractOtpFromText(textBody);
  if (otpFromText) {
    return otpFromText;
  }

  const subjectOtp = extractOtpFromText(message.subject ?? '');
  if (subjectOtp) {
    return subjectOtp;
  }

  const htmlOtp = extractOtpFromText(message.html?.body ?? '');
  if (htmlOtp) {
    return htmlOtp;
  }

  throw new Error('Could not find an OTP code in the Mailosaur message body.');
}

/**
 * Polls Mailosaur for the latest message sent to `email` and extracts a 4–6 digit OTP.
 */
function sortMessagesNewestFirst(
  messages: MailosaurMessageSummary[],
): MailosaurMessageSummary[] {
  return [...messages].sort((left, right) => {
    const leftTime = left.received ? Date.parse(left.received) : 0;
    const rightTime = right.received ? Date.parse(right.received) : 0;
    return rightTime - leftTime;
  });
}

export async function fetchOtpFromMailosaur(
  email: string,
  options: {
    timeoutMs?: number;
    pollIntervalMs?: number;
    receivedAfter?: Date;
  } = {},
): Promise<string> {
  const { serverId } = requireMailosaurConfig();
  const timeoutMs = options.timeoutMs ?? env.mailosaurOtpTimeoutMs;
  const pollIntervalMs = options.pollIntervalMs ?? env.mailosaurOtpPollIntervalMs;
  const deadline = Date.now() + timeoutMs;
  const sentTo = encodeURIComponent(email);
  const receivedAfterQuery = options.receivedAfter
    ? `&receivedAfter=${encodeURIComponent(options.receivedAfter.toISOString())}`
    : '';

  while (Date.now() < deadline) {
    const list = await mailosaurGet<MailosaurMessageList>(
      `/messages?server=${serverId}&sentTo=${sentTo}${receivedAfterQuery}`,
    );

    const latestMessage = sortMessagesNewestFirst(list.items ?? [])[0];
    if (latestMessage?.id) {
      const message = await mailosaurGet<MailosaurMessageBody>(
        `/messages/${latestMessage.id}`,
      );
      return extractOtpFromMessage(message);
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(
    `Timed out after ${timeoutMs}ms waiting for OTP email at ${email}.`,
  );
}
