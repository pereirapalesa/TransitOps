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

import type { AuthUser, LoginRequest } from "@/types/auth";
import { loginRequest } from "@/lib/api/auth";
import { setAccessToken } from "@/lib/auth/access-token-store";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session-cookie";

const STORAGE_KEY = "transitops.session";
const TOKEN_KEY = "transitops.access_token";

interface AuthContextValue {
  user: AuthUser | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  // Session is read synchronously on mount (client-only), so this flips to
  // false immediately after the first client render reconciles with SSR.
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Reading localStorage must happen client-side only (SSR has no
    // window), so this intentionally hydrates session state in an effect
    // rather than a lazy useState initializer, to avoid a hydration mismatch.
    const storedUser = readStoredUser();
    if (storedUser) {
      setUser(storedUser);
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (token) {
        setAccessToken(token);
        setSessionCookie();
      }
    }
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await loginRequest({
      email: payload.email,
      password: payload.password,
    });

    const apiUser = response.user;
    const access_token = response.access_token;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apiUser));
    window.localStorage.setItem(TOKEN_KEY, access_token);
    
    setAccessToken(access_token);
    setSessionCookie();
    setUser(apiUser);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    setAccessToken(null);
    clearSessionCookie();
    setUser(null);
    router.push("/");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      isAuthenticated: Boolean(user),
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
