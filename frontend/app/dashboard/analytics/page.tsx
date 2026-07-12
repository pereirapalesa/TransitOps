import { PageHeader, StatRow } from "@/components/dashboard/PageShell";

const utilizationByRegion = [
  { label: "Mumbai", color: "bg-primary", width: "88%" },
  { label: "Pune", color: "bg-primary", width: "74%" },
  { label: "Thane", color: "bg-primary", width: "61%" },
  { label: "Nashik", color: "bg-primary", width: "55%" },
];

const tripOutcomes = [
  { label: "Completed on time", color: "bg-success", width: "76%" },
  { label: "Completed late", color: "bg-warning", width: "17%" },
  { label: "Cancelled", color: "bg-destructive", width: "7%" },
];

const monthly = [
  { month: "Feb", value: 62 },
  { month: "Mar", value: 68 },
  { month: "Apr", value: 71 },
  { month: "May", value: 66 },
  { month: "Jun", value: 79 },
  { month: "Jul", value: 81 },
];

export default function AnalyticsPage() {
  const max = Math.max(...monthly.map((m) => m.value));

  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Analytics" description="Fleet utilization, trip outcomes, and performance trends." />

      <StatRow
        stats={[
          { label: "Fleet Utilization", value: "81%", color: "border-success" },
          { label: "On-Time Rate", value: "94%", color: "border-primary" },
          { label: "Safety Score", value: "98%", color: "border-success" },
          { label: "Cost / Km", value: "₹8.20", color: "border-primary" },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-panel p-5">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Utilization by Region</h2>
          <div className="space-y-5">
            {utilizationByRegion.map((row) => (
              <div key={row.label} className="flex items-center gap-4">
                <span className="w-16 text-sm text-muted-foreground">{row.label}</span>
                <div className="flex h-3 flex-1 overflow-hidden rounded-sm bg-panel-2">
                  <div className={`h-full ${row.color}`} style={{ width: row.width }} />
                </div>
                <span className="w-10 text-right text-xs text-subtle">{row.width}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-panel p-5">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Trip Outcomes</h2>
          <div className="space-y-5">
            {tripOutcomes.map((row) => (
              <div key={row.label} className="flex items-center gap-4">
                <span className="w-32 text-sm text-muted-foreground">{row.label}</span>
                <div className="flex h-3 flex-1 overflow-hidden rounded-sm bg-panel-2">
                  <div className={`h-full ${row.color}`} style={{ width: row.width }} />
                </div>
                <span className="w-10 text-right text-xs text-subtle">{row.width}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-panel p-5">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Fleet Utilization — Last 6 Months</h2>
        <div className="flex h-40 items-end gap-6">
          {monthly.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-sm bg-primary"
                  style={{ height: `${(m.value / max) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
