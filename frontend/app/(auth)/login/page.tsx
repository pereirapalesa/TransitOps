"use client";

import { Suspense } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

const FLEET_TICKER = [
  { id: "TX-2231", route: "Austin → Dallas", status: "On Trip" },
  { id: "TX-1187", route: "Houston → San Antonio", status: "Available" },
  { id: "TX-4402", route: "El Paso → Midland", status: "In Shop" },
  { id: "TX-0876", route: "Dallas → Waco", status: "On Trip" },
  { id: "TX-3319", route: "Lubbock → Amarillo", status: "Available" },
  { id: "TX-2755", route: "Fort Worth → Tyler", status: "On Trip" },
];

const STATUS_STYLES: Record<string, string> = {
  "On Trip": "text-signal-amber",
  Available: "text-signal-teal",
  "In Shop": "text-muted-foreground",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px]">
      {/* Signature panel: a live-feeling dispatch manifest board */}
      <section className="relative hidden overflow-hidden border-r border-border bg-background lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative z-10 px-12 pt-14">
          <div className="flex items-center gap-2.5 text-primary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M3 12h4l2-6h6l2 6h4M6 16h12M8 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM16 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-mono text-sm uppercase tracking-[0.25em]">TransitOps</span>
          </div>
          <h1 className="mt-16 max-w-md text-balance font-display text-4xl font-semibold leading-[1.15] text-foreground">
            Every vehicle, driver, and trip — one live operating picture.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Sign in to dispatch trips, track your fleet in real time, and keep drivers compliant.
          </p>
        </div>

        <div className="relative z-10 mb-10 px-12">
          <div className="flex items-center gap-2 px-1 pb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal-teal" />
            Live fleet manifest
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card/60">
            <table className="w-full font-mono text-[13px]">
              <tbody>
                {FLEET_TICKER.map((row) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-none">
                    <td className="px-4 py-2.5 text-muted-foreground">{row.id}</td>
                    <td className="px-4 py-2.5 text-foreground/80">{row.route}</td>
                    <td className={`px-4 py-2.5 text-right ${STATUS_STYLES[row.status] ?? "text-foreground"}`}>
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Login panel */}
      <section className="flex items-center justify-center bg-background px-6 py-16">
        <Suspense fallback={<div className="h-[420px] w-full max-w-md" />}>
          <AuthCard
            title="Sign in to your workspace"
            description="Use the email and password provided by your fleet administrator."
            footer={
              <p className="text-center text-sm text-muted-foreground">
                Trouble signing in?{" "}
                <a href="mailto:support@transitops.io" className="font-medium text-primary hover:underline">
                  Contact support
                </a>
              </p>
            }
          >
            <LoginForm />
          </AuthCard>
        </Suspense>
      </section>
    </main>
  );
}