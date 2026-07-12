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

import type { AuthUser, LoginRequest, RoleName } from "@/types/auth";

const STORAGE_KEY = "transitops.session";

interface AuthContextValue {
  user: AuthUser | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "user";
  return local
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Fleet User";
}

function buildMockUser(email: string, role: RoleName = "Dispatcher"): AuthUser {
  return {
    id: "local-user",
    organization_id: "local-org",
    full_name: nameFromEmail(email),
    email,
    is_active: true,
    last_login: new Date().toISOString(),
    role: { id: `role-${role.toLowerCase().replace(/\s+/g, "-")}`, name: role },
  };
}

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(readStoredUser());
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    // No backend in this build — any well-formed credentials sign in locally.
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser = buildMockUser(payload.email, payload.role);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
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
