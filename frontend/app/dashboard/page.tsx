"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { Overview } from "@/components/dashboard/Overview";

/**
 * Minimal placeholder so a successful login has somewhere real to land.
 * The full Dashboard module (KPI cards, fleet status, alerts, etc.) is a
 * separate feature — out of scope for the Auth module implemented here.
 */
export default function DashboardPage() {
  const { user, isInitializing, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Temporarily disabled auth redirect for UI testing
  // useEffect(() => {
  //   if (!isInitializing && !isAuthenticated) {
  //     router.replace("/login");
  //   }
  // }, [isInitializing, isAuthenticated, router]);

  // if (isInitializing) {
  //   return (
  //     <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
  //       <p className="font-mono text-sm text-[#8b949e]">Loading your workspace…</p>
  //     </main>
  //   );
  // }

  return <Overview />;
}
