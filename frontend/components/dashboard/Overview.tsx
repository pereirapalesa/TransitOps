"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchDashboardMetrics,
  fetchTrips,
  fetchVehicles,
  fetchDrivers,
} from "@/lib/api/transitops";

export function Overview() {
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics,
  });

  const { data: trips, isLoading: isTripsLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });

  const { data: vehicles, isLoading: isVehiclesLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
  });

  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
  });

  const vehicleMap = useMemo(() => {
    const map: Record<number, string> = {};
    vehicles?.forEach((v) => {
      map[v.id] = `${v.model} (${v.registration_number})`;
    });
    return map;
  }, [vehicles]);

  const driverMap = useMemo(() => {
    const map: Record<number, string> = {};
    drivers?.forEach((d) => {
      map[d.id] = d.name;
    });
    return map;
  }, [drivers]);

  const kpiCards = useMemo(() => {
    if (!metrics) return [];
    return [
      { label: "Active Vehicles", value: String(metrics.active_vehicles), color: "border-primary" },
      { label: "Available Vehicles", value: String(metrics.available_vehicles), color: "border-success" },
      { label: "Vehicles in Maintenance", value: String(metrics.maintenance_vehicles), color: "border-warning" },
      { label: "Active Trips", value: String(metrics.active_trips), color: "border-primary" },
      { label: "Pending Trips", value: String(metrics.pending_trips), color: "border-primary" },
      { label: "Drivers on Duty", value: String(metrics.drivers_on_duty), color: "border-primary" },
      { label: "Fleet Utilization", value: `${metrics.fleet_utilization}%`, color: "border-success" },
    ];
  }, [metrics]);

  const vehicleStatus = useMemo(() => {
    if (!vehicles || vehicles.length === 0) {
      return [
        { label: "Available", color: "bg-success", width: "0%" },
        { label: "On Trip", color: "bg-primary", width: "0%" },
        { label: "In Shop", color: "bg-warning", width: "0%" },
        { label: "Retired", color: "bg-destructive", width: "0%" },
      ];
    }
    const total = vehicles.length;
    const available = vehicles.filter((v) => v.status === "Available").length;
    const onTrip = vehicles.filter((v) => v.status === "On Trip").length;
    const inShop = vehicles.filter((v) => v.status === "In Shop").length;
    const retired = vehicles.filter((v) => v.status === "Retired").length;

    return [
      { label: "Available", color: "bg-success", width: `${(available / total) * 100}%` },
      { label: "On Trip", color: "bg-primary", width: `${(onTrip / total) * 100}%` },
      { label: "In Shop", color: "bg-warning", width: `${(inShop / total) * 100}%` },
      { label: "Retired", color: "bg-destructive", width: `${(retired / total) * 100}%` },
    ];
  }, [vehicles]);

  const recentTrips = useMemo(() => {
    if (!trips) return [];
    // Sort by id descending and pick top 4
    return [...trips]
      .sort((a, b) => b.id - a.id)
      .slice(0, 4)
      .map((t) => {
        let badgeClass = "bg-panel-2 text-muted-foreground";
        if (t.status === "Dispatched") {
          badgeClass = "bg-primary text-primary-foreground";
        } else if (t.status === "Completed") {
          badgeClass = "bg-success text-white";
        } else if (t.status === "Cancelled") {
          badgeClass = "bg-destructive text-destructive-foreground";
        }
        return {
          trip: `TR-${String(t.id).padStart(3, "0")}`,
          route: `${t.source} → ${t.destination}`,
          vehicle: vehicleMap[t.vehicle_id] ?? `Vehicle #${t.vehicle_id}`,
          driver: driverMap[t.driver_id] ?? `Driver #${t.driver_id}`,
          status: t.status,
          badgeClass,
          eta: `${t.planned_distance} km`,
        };
      });
  }, [trips, vehicleMap, driverMap]);

  if (isMetricsLoading || isTripsLoading || isVehiclesLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading dashboard metrics…</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 font-sans text-[#0f172a]">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className={`bg-white border border-[#e2e8f0] border-l-4 ${card.color} p-4 flex flex-col justify-center shadow-sm`}>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-3xl text-[#0f172a] font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Recent Trips */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Recent Trips</h2>
          <div className="overflow-x-auto rounded-lg border border-border bg-panel">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border font-mono text-xs uppercase tracking-wider text-subtle">
                  <th className="px-4 py-3 font-medium">Trip</th>
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Distance</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#0f172a]">
                {recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground font-mono text-xs">
                      No recent trips found.
                    </td>
                  </tr>
                ) : (
                  recentTrips.map((trip, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-none">
                      <td className="px-4 py-4 font-mono font-medium text-blue-600">{trip.trip}</td>
                      <td className="px-4 py-4">{trip.route}</td>
                      <td className="px-4 py-4">{trip.vehicle}</td>
                      <td className="px-4 py-4">{trip.driver}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${trip.badgeClass}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{trip.eta}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status */}
        <div>
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Vehicle Status</h2>
          <div className="space-y-6 rounded-lg border border-border bg-panel p-5">
            {vehicleStatus.map((status) => (
              <div key={status.label} className="flex items-center gap-4">
                <span className="w-20 text-sm text-muted-foreground">{status.label}</span>
                <div className="flex h-3 flex-1 overflow-hidden rounded-sm bg-panel-2">
                  <div className={`h-full ${status.color}`} style={{ width: status.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
