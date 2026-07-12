"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

/**
 * Minimal placeholder so a successful login has somewhere real to land.
 * The full Dashboard module (KPI cards, fleet status, alerts, etc.) is a
 * separate feature — out of scope for the Auth module implemented here.
 */
export default function DashboardPage() {
  const { user, isInitializing, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-sm text-muted-foreground">Loading your workspace…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal-teal">Signed in</p>
        <h1 className="font-display text-3xl font-semibold text-foreground">Welcome back, {user.full_name}</h1>
        <p className="text-sm text-muted-foreground">
          {user.role.name} · {user.email}
        </p>
      </div>
      <Button variant="outline" onClick={() => void logout()}>
        Log out
      </Button>
    </main>
  );
}
