"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageShell";
import { useAuth } from "@/lib/auth/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Settings" description="Account, notifications, and workspace preferences." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-panel p-6">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Profile</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" defaultValue={user?.full_name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" defaultValue={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={user?.role.name ?? "Dispatcher"} disabled />
            </div>
            <Button className="mt-2">Save changes</Button>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-panel p-6">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Notifications</h2>
          <div className="space-y-4 text-sm">
            {[
              "Trip status changes",
              "Maintenance due reminders",
              "Expense approvals",
              "Driver compliance alerts",
            ].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-md border border-border bg-panel-2 px-4 py-3">
                <span className="text-foreground/90">{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
