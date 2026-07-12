import { Badge, DataTable, PageHeader, StatRow } from "@/components/dashboard/PageShell";

const workOrders = [
  { id: "WO-1042", vehicle: "VAN-11", type: "Brake service", due: "14 Jul 2026", status: "In Progress" as const },
  { id: "WO-1043", vehicle: "TRK-03", type: "Oil change", due: "16 Jul 2026", status: "Scheduled" as const },
  { id: "WO-1039", vehicle: "MINI-14", type: "Tyre replacement", due: "10 Jul 2026", status: "Overdue" as const },
  { id: "WO-1041", vehicle: "TRK-12", type: "Annual inspection", due: "22 Jul 2026", status: "Scheduled" as const },
  { id: "WO-1035", vehicle: "VAN-05", type: "AC repair", due: "05 Jul 2026", status: "Completed" as const },
];

const toneMap = {
  "In Progress": "default",
  Scheduled: "muted",
  Overdue: "destructive",
  Completed: "success",
} as const;

export default function MaintenancePage() {
  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Maintenance" description="Work orders, service schedules, and vehicle downtime." />

      <StatRow
        stats={[
          { label: "Open Work Orders", value: "12", color: "border-primary" },
          { label: "Overdue", value: "02", color: "border-destructive" },
          { label: "Scheduled This Week", value: "07", color: "border-primary" },
          { label: "Completed (30d)", value: "48", color: "border-success" },
        ]}
      />

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Work Orders</h2>
        <DataTable
          columns={["Order", "Vehicle", "Service", "Due", "Status"]}
          rows={workOrders.map((w) => [
            w.id,
            w.vehicle,
            w.type,
            w.due,
            <Badge key={w.id} tone={toneMap[w.status]}>{w.status}</Badge>,
          ])}
        />
      </div>
    </div>
  );
}
