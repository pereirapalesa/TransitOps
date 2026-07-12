"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useAuth } from "@/lib/auth/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/");
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="font-mono text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    );
  }

  return (
  <div className="flex flex-col h-screen overflow-hidden bg-[#ffffff]  text-black">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}