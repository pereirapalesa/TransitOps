/**
 * The access token is memory-only and the refresh token lives in
 * localStorage (see token-storage.ts) — neither is readable by Next.js
 * middleware, which runs on the edge and only sees cookies. To let
 * middleware do coarse-grained route gating (redirect to /login when
 * clearly signed out) without touching the tokens themselves, we set a
 * non-sensitive presence flag cookie alongside the real session. This
 * cookie proves nothing on its own — every API request is still verified
 * against the real JWT signature server-side — it only avoids flashing
 * protected pages at a signed-out visitor before a client-side redirect
 * would otherwise catch it.
 */
const SESSION_COOKIE_NAME = "transitops_session";
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days, matches refresh token lifetime

export function setSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${SESSION_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export const SESSION_COOKIE_KEY = SESSION_COOKIE_NAME;
