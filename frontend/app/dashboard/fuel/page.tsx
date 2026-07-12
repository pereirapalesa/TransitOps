import { Badge, DataTable, PageHeader, StatRow } from "@/components/dashboard/PageShell";

const expenses = [
  { id: "EX-3301", vehicle: "VAN-05", category: "Fuel", amount: "₹4,250", date: "10 Jul 2026", status: "Approved" as const },
  { id: "EX-3302", vehicle: "TRK-12", category: "Toll", amount: "₹860", date: "10 Jul 2026", status: "Approved" as const },
  { id: "EX-3305", vehicle: "MINI-08", category: "Fuel", amount: "₹2,140", date: "11 Jul 2026", status: "Pending" as const },
  { id: "EX-3299", vehicle: "TRK-03", category: "Repair", amount: "₹12,600", date: "08 Jul 2026", status: "Rejected" as const },
  { id: "EX-3308", vehicle: "VAN-11", category: "Fuel", amount: "₹3,980", date: "12 Jul 2026", status: "Pending" as const },
];

const toneMap = {
  Approved: "success",
  Pending: "default",
  Rejected: "destructive",
} as const;

export default function FuelExpensesPage() {
  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Fuel & Expenses" description="Fuel consumption, tolls, repairs, and reimbursements." />

      <StatRow
        stats={[
          { label: "This Month", value: "₹4.8L", color: "border-primary" },
          { label: "Avg Fuel / Vehicle", value: "₹3,412", color: "border-primary" },
          { label: "Pending Approval", value: "₹6,120", color: "border-warning" },
          { label: "Rejected", value: "₹12,600", color: "border-destructive" },
        ]}
      />

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Recent Expenses</h2>
        <DataTable
          columns={["Entry", "Vehicle", "Category", "Amount", "Date", "Status"]}
          rows={expenses.map((e) => [
            e.id,
            e.vehicle,
            e.category,
            e.amount,
            e.date,
            <Badge key={e.id} tone={toneMap[e.status]}>{e.status}</Badge>,
          ])}
        />
      </div>
    </div>
  );
}
