import { jwtDecode } from "jwt-decode";

import type { DecodedAccessToken } from "@/types/auth";

/** Decodes a JWT without verifying its signature. Client-side use only —
 * for UI concerns like "is this token about to expire", never for
 * authorization decisions (the backend is the source of truth for that).
 */
export function decodeToken(token: string): DecodedAccessToken | null {
  try {
    return jwtDecode<DecodedAccessToken>(token);
  } catch {
    return null;
  }
}

/** Returns true if the token is expired or will expire within `skewSeconds`. */
export function isTokenExpiring(token: string, skewSeconds = 30): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  const nowSeconds = Date.now() / 1000;
  return decoded.exp - nowSeconds <= skewSeconds;
}

export function getTokenExpiryMs(token: string): number | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return decoded.exp * 1000;
}
