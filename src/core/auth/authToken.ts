/**
 * Central store for the guest access token.
 * All authenticated API calls read the token from here.
 */
let accessToken: string | undefined;

export function getAccessToken(): string | undefined {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = undefined;
}

export function requireAccessToken(): string {
  if (!accessToken) {
    throw new Error(
      'No access token available. Call ensureGuestAuth() before making authenticated requests.',
    );
  }
  return accessToken;
}
