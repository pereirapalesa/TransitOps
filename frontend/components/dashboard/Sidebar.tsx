"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Fleet", href: "/dashboard/fleet", icon: Truck },
  { name: "Drivers", href: "/dashboard/drivers", icon: Users },
  { name: "Trips", href: "/dashboard/trips", icon: Route },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Fuel & Expenses", href: "/dashboard/fuel", icon: Fuel },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const roleNavMap: Record<string, string[]> = {
  "Fleet Manager": ["Dashboard", "Fleet", "Drivers", "Trips", "Maintenance", "Fuel & Expenses", "Analytics", "Settings"],
  "Admin": ["Dashboard", "Fleet", "Drivers", "Trips", "Maintenance", "Fuel & Expenses", "Analytics", "Settings"],
  "Financial Analyst": ["Dashboard", "Fuel & Expenses", "Analytics", "Settings"],
  "Driver": ["Dashboard", "Trips", "Settings"],
  "Safety Officer": ["Dashboard", "Drivers", "Settings"],
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const roleName = user?.role?.name ?? "Driver";
  const allowedNames = roleNavMap[roleName] ?? ["Dashboard", "Settings"];
  const visibleItems = navItems.filter((item) => allowedNames.includes(item.name));

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-panel font-sans md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M3 12h4l2-6h6l2 6h4M6 16h12M8 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM16 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1 className="font-mono text-sm uppercase tracking-[0.2em] text-foreground">TransitOps</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-3">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-accent bg-panel-2 text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-panel-2 hover:text-foreground"
                  }`}
                >
                  <Icon size={17} className={isActive ? "text-accent" : "text-subtle"} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">TransitOps © 2026</p>
      </div>
    </aside>
  );
}
