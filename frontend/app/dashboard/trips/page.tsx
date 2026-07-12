import { Badge, DataTable, PageHeader, StatRow } from "@/components/dashboard/PageShell";

const trips = [
  { trip: "TR001", route: "Mumbai → Pune", vehicle: "VAN-05", driver: "Alex", status: "On Trip" as const, eta: "45 min" },
  { trip: "TR002", route: "Delhi → Jaipur", vehicle: "TRK-12", driver: "John", status: "Completed" as const, eta: "—" },
  { trip: "TR003", route: "Bengaluru → Mysuru", vehicle: "MINI-08", driver: "Priya", status: "Dispatched" as const, eta: "1h 10m" },
  { trip: "TR004", route: "Chennai → Coimbatore", vehicle: "—", driver: "—", status: "Draft" as const, eta: "Awaiting vehicle" },
  { trip: "TR005", route: "Ahmedabad → Surat", vehicle: "TRK-03", driver: "Neha", status: "On Trip" as const, eta: "1h 55m" },
];

const toneMap = {
  "On Trip": "default",
  Completed: "success",
  Dispatched: "default",
  Draft: "muted",
} as const;

export default function TripsPage() {
  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Trips" description="Active, dispatched, and completed trips across the fleet." />

      <StatRow
        stats={[
          { label: "Active Trips", value: "18", color: "border-primary" },
          { label: "Pending Trips", value: "09", color: "border-primary" },
          { label: "Completed Today", value: "34", color: "border-success" },
          { label: "Drafts", value: "04", color: "border-primary" },
        ]}
      />

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">All Trips</h2>
        <DataTable
          columns={["Trip", "Route", "Vehicle", "Driver", "Status", "ETA"]}
          rows={trips.map((t) => [
            t.trip,
            t.route,
            t.vehicle,
            t.driver,
            <Badge key={t.trip} tone={toneMap[t.status]}>{t.status}</Badge>,
            t.eta,
          ])}
        />
      </div>
    </div>
  );
}
