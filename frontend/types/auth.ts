export type RoleName =
  | "Admin"
  | "Fleet Manager"
  | "Dispatcher"
  | "Driver"
  | "Safety Officer"
  | "Financial Analyst";

export interface Role {
  id: string;
  name: RoleName;
}

export interface AuthUser {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  last_login: string | null;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
  role?: RoleName;
}

/* ---------------------------------------------------------------------
 * The types below back the real-backend auth flow (lib/api/*, lib/auth/jwt.ts,
 * token-storage.ts, access-token-store.ts, session-cookie.ts). Nothing in
 * the app currently imports that flow — the app uses a local mock login
 * (lib/auth/auth-context.tsx) — but these stay in place, ready to wire up
 * once a real backend exists.
 * ------------------------------------------------------------------- */

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiErrorPayload {
  detail: string;
}

/** Shape of the JWT access-token payload, decoded client-side only for
 * expiry checks / role display — never trust this for authorization,
 * the backend re-verifies the signature on every request. */
export interface DecodedAccessToken {
  sub: string;
  email: string;
  role: RoleName;
  organization_id: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
  jti: string;
}
