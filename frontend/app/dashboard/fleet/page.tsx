"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import FleetListPage from "@/components/fleet/FleetListPage";

export default function FleetPage() {
  const { isInitializing, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return <FleetListPage />;
}
