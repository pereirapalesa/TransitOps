"use client";

import { useQuery } from "@tanstack/react-query";

import { PageHeader, StatRow } from "@/components/dashboard/PageShell";
import {
  fetchDashboardMetrics,
  fetchFuelEfficiency,
  fetchOperationalCosts,
  OperationalCostSummary,
  FuelEfficiencySummary,
  DashboardMetrics,
} from "@/lib/api/transitops";

export default function AnalyticsPage() {
  const { data: metrics } = useQuery<DashboardMetrics>({
    queryKey: ["dashboard-metrics"],
    queryFn: fetchDashboardMetrics,
  });

  const { data: costs = [], isLoading: costsLoading } = useQuery<OperationalCostSummary[]>({
    queryKey: ["operational-costs"],
    queryFn: fetchOperationalCosts,
  });

  const { data: efficiency = [], isLoading: effLoading } = useQuery<FuelEfficiencySummary[]>({
    queryKey: ["fuel-efficiency"],
    queryFn: fetchFuelEfficiency,
  });

  const utilization = metrics?.fleet_utilization ?? 0;

  const maxCost = Math.max(...costs.map((c) => c.total_cost), 1);
  const maxEff = Math.max(...efficiency.map((e) => e.efficiency), 1);

  const totalFuelCostSum = costs.reduce((s, c) => s + (c.fuel_cost ?? 0), 0);
  const totalMaintenanceCostSum = costs.reduce((s, c) => s + (c.maintenance_cost ?? 0), 0);
  const avgEfficiency =
    efficiency.length > 0
      ? (efficiency.reduce((s, e) => s + e.efficiency, 0) / efficiency.length).toFixed(2)
      : "—";

  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Analytics" description="Fleet utilization, operational costs, and fuel efficiency metrics." />

      <StatRow
        stats={[
          {
            label: "Fleet Utilization",
            value: `${utilization.toFixed(1)}%`,
            color: utilization > 70 ? "border-success" : "border-primary",
          },
          { label: "Fuel Costs", value: `₹${totalFuelCostSum.toLocaleString("en-IN")}`, color: "border-primary" },
          { label: "Maintenance Costs", value: `₹${totalMaintenanceCostSum.toLocaleString("en-IN")}`, color: "border-primary" },
          { label: "Avg Fuel Efficiency", value: `${avgEfficiency} km/L`, color: "border-success" },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Operational Cost by Vehicle */}
        <div className="rounded-lg border border-border bg-panel p-5">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Operational Cost per Vehicle
          </h2>
          {costsLoading ? (
            <p className="animate-pulse text-sm text-muted-foreground">Loading…</p>
          ) : costs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cost data available yet.</p>
          ) : (
            <div className="space-y-4">
              {costs.slice(0, 8).map((c) => (
                <div key={c.vehicle_id} className="flex items-center gap-4">
                  <span className="w-28 truncate text-sm text-muted-foreground" title={c.registration_number}>
                    {c.registration_number}
                  </span>
                  <div className="flex h-3 flex-1 overflow-hidden rounded-sm bg-panel-2">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min((c.total_cost / maxCost) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-xs text-subtle">
                    ₹{c.total_cost.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fuel Efficiency by Vehicle */}
        <div className="rounded-lg border border-border bg-panel p-5">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Fuel Efficiency (km/L)
          </h2>
          {effLoading ? (
            <p className="animate-pulse text-sm text-muted-foreground">Loading…</p>
          ) : efficiency.length === 0 ? (
            <p className="text-sm text-muted-foreground">No fuel data available yet.</p>
          ) : (
            <div className="space-y-4">
              {efficiency.slice(0, 8).map((e) => (
                <div key={e.vehicle_id} className="flex items-center gap-4">
                  <span className="w-28 truncate text-sm text-muted-foreground" title={e.registration_number}>
                    {e.registration_number}
                  </span>
                  <div className="flex h-3 flex-1 overflow-hidden rounded-sm bg-panel-2">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${Math.min((e.efficiency / maxEff) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-xs text-subtle">{e.efficiency.toFixed(1)} km/L</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cost breakdown stacked bar */}
      {costs.length > 0 && (
        <div className="rounded-lg border border-border bg-panel p-5">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Cost Breakdown — Fuel vs Maintenance
          </h2>
          <div className="space-y-3">
            {costs.slice(0, 8).map((c) => {
              const total = (c.fuel_cost ?? 0) + (c.maintenance_cost ?? 0) || 1;
              const fuelPct = ((c.fuel_cost ?? 0) / total) * 100;
              const maintPct = ((c.maintenance_cost ?? 0) / total) * 100;
              return (
                <div key={c.vehicle_id} className="flex items-center gap-4">
                  <span className="w-28 truncate text-sm text-muted-foreground">{c.registration_number}</span>
                  <div className="flex h-4 flex-1 overflow-hidden rounded-sm">
                    <div className="h-full bg-primary" style={{ width: `${fuelPct}%` }} title={`Fuel: ₹${c.fuel_cost}`} />
                    <div className="h-full bg-warning" style={{ width: `${maintPct}%` }} title={`Maintenance: ₹${c.maintenance_cost}`} />
                  </div>
                  <span className="w-20 text-right text-xs text-subtle">₹{c.total_cost.toLocaleString("en-IN")}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" /> Fuel</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-warning" /> Maintenance</span>
          </div>
        </div>
      )}
    </div>
  );
}
