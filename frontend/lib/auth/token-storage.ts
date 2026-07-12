/**
 * Refresh-token persistence.
 *
 * The backend issues tokens over the JSON response body rather than as
 * httpOnly cookies (see Phase 1 architecture doc, Open Question #3), so an
 * httpOnly-cookie flow isn't available without a backend change. Given that
 * constraint, this MVP keeps the access token in memory only (see
 * lib/auth/auth-context.tsx — never written to storage) and persists just
 * the refresh token in localStorage so a page reload can silently obtain a
 * new access token instead of forcing a full re-login. This narrows the
 * XSS-exposed surface to the refresh token alone. Migrating the backend to
 * set the refresh token as an httpOnly, Secure, SameSite=Strict cookie is
 * the recommended hardening for a production deployment.
 */

const REFRESH_TOKEN_KEY = "transitops.refresh_token";

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setStoredRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearStoredRefreshToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
