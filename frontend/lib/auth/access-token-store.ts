/**
 * The access token lives only in memory (module-level state), never in
 * localStorage/sessionStorage — this is what keeps it out of reach of a
 * successful XSS read of persisted storage. React state in AuthProvider is
 * the source of truth for rendering; this plain-object mirror lets the
 * axios interceptor (which lives outside the React tree) read/write the
 * current token without prop-drilling or a circular import.
 */
let currentAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return currentAccessToken;
}

export function setAccessToken(token: string | null): void {
  currentAccessToken = token;
}
