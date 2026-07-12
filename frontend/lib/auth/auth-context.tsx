"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchCurrentUser, loginRequest, logoutRequest } from "@/lib/api/auth";
import {
  clearSession,
  extractApiErrorMessage,
  persistSession,
  refreshAccessToken,
  registerAuthFailureHandler,
} from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/access-token-store";
import { getStoredRefreshToken } from "@/lib/auth/token-storage";
import type { AuthUser, LoginRequest } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial silent-refresh-on-load check is in flight. */
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();
    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch {
      // Best-effort server-side revocation — client state is cleared regardless.
    } finally {
      clearSession();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    registerAuthFailureHandler(() => {
      setUser(null);
      router.push("/login");
    });
  }, [router]);

  // On mount: if a refresh token is stored, silently exchange it for a
  // fresh access token and hydrate the user profile, so a page reload
  // doesn't force a re-login.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        setIsInitializing(false);
        return;
      }

      try {
        await refreshAccessToken();
        const currentUser = await fetchCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    try {
      const response = await loginRequest(payload);
      persistSession(response.access_token, response.refresh_token);
      setUser(response.user);
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, "Login failed. Please check your credentials."));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      isAuthenticated: Boolean(user) && Boolean(getAccessToken()),
      login,
      logout,
    }),
    [user, isInitializing, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
