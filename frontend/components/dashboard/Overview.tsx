"use client";

const kpiCards = [
  { label: "ACTIVE VEHICLES", value: "53", color: "border-blue-500" },
  { label: "AVAILABLE VEHICLES", value: "42", color: "border-green-500" },
  { label: "VEHICLES IN MAINTENANCE", value: "05", color: "border-orange-500" },
  { label: "ACTIVE TRIPS", value: "18", color: "border-blue-500" },
  { label: "PENDING TRIPS", value: "09", color: "border-blue-500" },
  { label: "DRIVERS ON DUTY", value: "26", color: "border-blue-500" },
  { label: "FLEET UTILIZATION", value: "81%", color: "border-green-500" },
];

const recentTrips = [
  { trip: "TR001", vehicle: "VAN-05", driver: "Alex", status: "On Trip", badgeClass: "bg-blue-500", eta: "45 min" },
  { trip: "TR002", vehicle: "TRK-12", driver: "John", status: "Completed", badgeClass: "bg-green-600", eta: "—" },
  { trip: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", badgeClass: "bg-blue-400", eta: "1h 10m" },
  { trip: "TR004", vehicle: "—", driver: "—", status: "Draft", badgeClass: "bg-[#3b414d]", eta: "Awaiting vehicle" },
];

const vehicleStatus = [
  { label: "Available", color: "bg-green-500", width: "80%" },
  { label: "On Trip", color: "bg-blue-500", width: "45%" },
  { label: "In Shop", color: "bg-orange-500", width: "15%" },
  { label: "Retired", color: "bg-red-400", width: "5%" },
];

export function Overview() {
  return (
    <div className="p-8 space-y-8 font-sans text-[#0f172a]">
      {/* Filters */}
      <div className="flex gap-4 mb-8 text-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#5b6470] uppercase tracking-wider font-semibold">Filters</label>
          <div className="flex gap-4">
            <select className="bg-transparent border border-[#2a2e37] text-[#8b949e] rounded px-3 py-1.5 focus:outline-none focus:border-[#4b5563] appearance-none cursor-pointer pr-8">
              <option>Vehicle Type: All</option>
            </select>
            <select className="bg-transparent border border-[#2a2e37] text-[#8b949e] rounded px-3 py-1.5 focus:outline-none focus:border-[#4b5563] appearance-none cursor-pointer pr-8">
              <option>Status: All</option>
            </select>
            <select className="bg-transparent border border-[#2a2e37] text-[#8b949e] rounded px-3 py-1.5 focus:outline-none focus:border-[#4b5563] appearance-none cursor-pointer pr-8">
              <option>Region: All</option>
            </select>
          </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Recent Trips */}
        <div className="lg:col-span-2">
          <h2 className="text-xs text-[#8b949e] uppercase tracking-widest font-semibold mb-4">Recent Trips</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2a2e37] text-xs text-[#5b6470] uppercase tracking-wider">
                  <th className="pb-3 font-medium">Trip</th>
                  <th className="pb-3 font-medium">Vehicle</th>
                  <th className="pb-3 font-medium">Driver</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">ETA</th>
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
                    <td className="py-4 text-[#8b949e]">{trip.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status */}
        <div>
          <h2 className="text-xs text-[#8b949e] uppercase tracking-widest font-semibold mb-6">Vehicle Status</h2>
          <div className="space-y-6">
            {vehicleStatus.map((status, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm text-[#8b949e] w-20">{status.label}</span>
                <div className="flex-1 h-3 bg-[#1a1d24] rounded-sm overflow-hidden flex">
                  <div className={`h-full ${status.color}`} style={{ width: status.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
