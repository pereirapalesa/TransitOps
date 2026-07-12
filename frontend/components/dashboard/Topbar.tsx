"use client";

import { Search, LogOut } from "lucide-react";

import ThemeToggle from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";

export function Topbar() {
  const { user, logout } = useAuth();

  const displayName = user?.full_name ?? "Fleet User";
  const roleName = user?.role.name ?? "Dispatcher";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-panel px-8 font-sans">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="text"
          placeholder="Search..."
          className="w-80 rounded-lg border border-border bg-panel-2 py-2 pl-9 pr-4 text-sm text-foreground placeholder-subtle transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm font-medium text-foreground">{displayName}</span>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 rounded-full border border-border bg-panel-2 py-1 pl-3 pr-1 transition-colors hover:bg-border/40"
          title="Sign out"
        >
          <span className="px-1 text-xs font-medium text-primary">{roleName}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-border text-xs font-semibold text-foreground">
            {initials}
          </span>
        </button>
        <button
          onClick={() => logout()}
          className="rounded-lg border border-border p-2 text-subtle transition-colors hover:bg-panel-2 hover:text-foreground"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
