import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { getAccessToken, setAccessToken } from "@/lib/auth/access-token-store";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth/session-cookie";
import {
  clearStoredRefreshToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
} from "@/lib/auth/token-storage";
import type { ApiErrorPayload, RefreshResponse } from "@/types/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Attach the current access token to every outgoing request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface RetriableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/** A logout callback the AuthProvider registers so the interceptor can fully
 * clear client state (not just tokens) when refresh fails irrecoverably.
 */
let onAuthFailure: (() => void) | null = null;
export function registerAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler;
}

let refreshInFlight: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { "Content-Type": "application/json" } }
  );

  setAccessToken(response.data.access_token);
  return response.data.access_token;
}

export async function refreshAccessToken(): Promise<string> {
  refreshInFlight = refreshInFlight ?? performRefresh();
  try {
    const token = await refreshInFlight;
    return token;
  } finally {
    refreshInFlight = null;
  }
}
// On any 401 (except the auth endpoints themselves), try exactly one silent
// refresh, replay the original request, and otherwise force a logout.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        refreshInFlight = refreshInFlight ?? performRefresh();
        const newAccessToken = await refreshInFlight;
        refreshInFlight = null;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshInFlight = null;
        setAccessToken(null);
        clearStoredRefreshToken();
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function persistSession(accessToken: string, refreshToken: string): void {
  setAccessToken(accessToken);
  setStoredRefreshToken(refreshToken);
  setSessionCookie();
}

export function clearSession(): void {
  setAccessToken(null);
  clearStoredRefreshToken();
  clearSessionCookie();
}

export function extractApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.detail ?? fallback;
  }
  return fallback;
}
