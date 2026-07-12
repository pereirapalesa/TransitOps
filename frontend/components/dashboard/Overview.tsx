"use client";

const kpiCards = [
  { label: "Active Vehicles", value: "53", color: "border-primary" },
  { label: "Available Vehicles", value: "42", color: "border-success" },
  { label: "Vehicles in Maintenance", value: "05", color: "border-warning" },
  { label: "Active Trips", value: "18", color: "border-primary" },
  { label: "Pending Trips", value: "09", color: "border-primary" },
  { label: "Drivers on Duty", value: "26", color: "border-primary" },
  { label: "Fleet Utilization", value: "81%", color: "border-success" },
];

const recentTrips = [
  { trip: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", badgeClass: "bg-primary text-primary-foreground", eta: "45 min" },
  { trip: "TR002", vehicle: "TRK-12", driver: "John", status: "Completed", badgeClass: "bg-success text-white", eta: "—" },
  { trip: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", badgeClass: "bg-primary/70 text-primary-foreground", eta: "1h 10m" },
  { trip: "TR004", vehicle: "—", driver: "—", status: "Draft", badgeClass: "bg-panel-2 text-muted-foreground", eta: "Awaiting vehicle" },
];

const vehicleStatus = [
  { label: "Available", color: "bg-success", width: "80%" },
  { label: "On Trip", color: "bg-primary", width: "45%" },
  { label: "In Shop", color: "bg-warning", width: "15%" },
  { label: "Retired", color: "bg-destructive", width: "5%" },
];

export function Overview() {
  return (
    <div className="p-8 space-y-8 font-sans text-[#0f172a]">
      {/* Filters */}
      <div className="flex flex-col gap-1 text-sm">
        <label className="font-mono text-xs uppercase tracking-wider text-subtle">Filters</label>
        <div className="flex flex-wrap gap-4">
          <select className="cursor-pointer appearance-none rounded border border-border bg-transparent px-3 py-1.5 pr-8 text-muted-foreground focus:border-primary focus:outline-none">
            <option>Vehicle Type: All</option>
          </select>
          <select className="cursor-pointer appearance-none rounded border border-border bg-transparent px-3 py-1.5 pr-8 text-muted-foreground focus:border-primary focus:outline-none">
            <option>Status: All</option>
          </select>
          <select className="cursor-pointer appearance-none rounded border border-border bg-transparent px-3 py-1.5 pr-8 text-muted-foreground focus:border-primary focus:outline-none">
            <option>Region: All</option>
          </select>
        </div>
      </div>

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
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">ETA</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#0f172a]">
                {recentTrips.map((trip, idx) => (
                  <tr key={idx} className="border-b border-[#1a1d24]">
                    <td className="py-4">{trip.trip}</td>
                    <td className="py-4">{trip.vehicle}</td>
                    <td className="py-4">{trip.driver}</td>
                    <td className="py-4">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${trip.badgeClass}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{trip.eta}</td>
                  </tr>
                ))}
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
