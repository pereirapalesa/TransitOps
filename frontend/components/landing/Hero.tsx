import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";

import { AuthCard } from "@/components/auth/AuthCard";
import LoginForm  from "@/components/auth/LoginForm";

const FLEET_TICKER = [
  { id: "TR-2231", route: "Mumbai → Pune", status: "On Trip" },
  { id: "TR-1187", route: "Delhi → Jaipur", status: "Available" },
  { id: "TR-4402", route: "Bengaluru → Mysuru", status: "In Shop" },
  { id: "TR-0876", route: "Ahmedabad → Surat", status: "On Trip" },
  { id: "TR-3319", route: "Chennai → Coimbatore", status: "Available" },
];

const STATUS_STYLES: Record<string, string> = {
  "On Trip": "text-primary",
  Available: "text-success",
  "In Shop": "text-warning",
};

const trustPoints = [
  "Real-time fleet monitoring",
  "Intelligent trip management",
  "Preventive maintenance",
  "Analytics & reports",
];

export default function Hero() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px]">
      {/* Left — brand statement (kept from the original hero copy) */}
      <div className="relative hidden overflow-hidden border-r border-border bg-background lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid pointer-events-none absolute inset-0" />

        <div className="relative z-10 px-12 pt-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Modern Fleet Management Platform
          </span>

          <h1 className="mt-8 max-w-xl text-balance font-display text-5xl font-semibold leading-[1.1] text-foreground">
            Smarter fleet management for modern businesses.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Manage vehicles, drivers, trips, maintenance, fuel expenses, and
            performance from one centralized operations platform.
          </p>

          <div className="mt-10 grid gap-3.5 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2.5">
                <CheckCircle2 className="shrink-0 text-success" size={18} />
                <span className="text-sm text-foreground/90">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mb-10 px-12">
          <div className="flex items-center gap-2 px-1 pb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
            Live fleet manifest
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-panel/70">
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
      </div>

      {/* Right — login form */}
      <div className="flex items-center justify-center bg-background px-6 py-16">
        <Suspense fallback={<div className="h-[460px] w-full max-w-md" />}>
          <AuthCard
            title="Sign in to your account"
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
      </div>
    </section>
  );
}