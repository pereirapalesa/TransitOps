import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CircleDollarSign,
  Fuel,
  MapPinned,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

const fleetStats = [
  {
    title: "Total Fleet",
    value: "124",
    change: "+12%",
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Active Trips",
    value: "87",
    change: "+8%",
    icon: MapPinned,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Drivers",
    value: "89",
    change: "+5%",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Monthly Revenue",
    value: "$86K",
    change: "+18%",
    icon: CircleDollarSign,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const vehicles = [
  {
    id: "TR-201",
    driver: "Rahul Sharma",
    route: "Mumbai → Pune",
    status: "Running",
  },
  {
    id: "TR-145",
    driver: "Neha Singh",
    route: "Delhi → Jaipur",
    status: "Maintenance",
  },
  {
    id: "TR-332",
    driver: "Amit Patel",
    route: "Bangalore → Mysore",
    status: "Idle",
  },
  {
    id: "TR-411",
    driver: "Riya Gupta",
    route: "Hyderabad → Chennai",
    status: "Running",
  },
];

const maintenance = [
  "Oil Replacement",
  "Brake Inspection",
  "Engine Diagnostics",
  "Tyre Rotation",
];

export default function DashboardPreview({
  isAppView = false,
  userFullName = "",
  onLogout,
}: {
  isAppView?: boolean;
  userFullName?: string;
  onLogout?: () => void;
} = {}) {
  return (
    <section
      id={!isAppView ? "modules" : undefined}
      className={isAppView ? "bg-slate-50 min-h-screen" : "bg-white py-28"}
    >
      <div className={isAppView ? "h-full w-full" : "mx-auto max-w-7xl px-6 lg:px-8"}>

        {!isAppView && (

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Dashboard Preview
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Everything Your Fleet Needs In One Dashboard
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            Monitor vehicles, drivers, maintenance schedules, expenses,
            operational KPIs and fleet performance from a centralized ERP.
          </p>

        </div>
        )}

        {/* Window */}

        <div className={isAppView ? "h-screen flex flex-col" : "mt-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"}>

          {/* Fake Browser */}

          {!isAppView && (
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">

            <div className="flex gap-2">

              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>

            </div>

            <div className="rounded-lg bg-white px-5 py-2 text-sm text-slate-500 shadow-sm">
              dashboard.transitops.com
            </div>

            <div></div>
          </div>
          )}

          <div className={isAppView ? "flex-1 grid lg:grid-cols-12 min-h-0" : "grid lg:grid-cols-12"}>

            {/* Sidebar */}

            <aside className={isAppView ? "hidden bg-slate-900 lg:col-span-2 xl:col-span-2 lg:flex flex-col h-full overflow-y-auto" : "hidden bg-slate-900 lg:col-span-3 lg:block"}>

              <div className="border-b border-slate-800 p-8">

                <h3 className="text-2xl font-bold text-white">
                  TransitOps
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Fleet ERP Platform
                </p>
              </div>

              <nav className="space-y-2 p-6 flex-1">

                {[
                  "Dashboard",
                  "Fleet",
                  "Drivers",
                  "Trips",
                  "Maintenance",
                  "Fuel Logs",
                  "Reports",
                  "Analytics",
                ].map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-xl px-5 py-3 text-sm transition ${
                      index === 0
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {item}
                  </div>
                ))}

              </nav>

              {isAppView && onLogout && (
                <div className="p-6 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-4 text-center truncate">
                    Welcome, {userFullName}
                  </p>
                  <button
                    onClick={onLogout}
                    className="w-full rounded-xl bg-slate-800 px-5 py-3 text-white transition hover:bg-slate-700"
                  >
                    Log out
                  </button>
                </div>
              )}

            </aside>

            {/* Main */}

            <div className={isAppView ? "p-8 lg:col-span-10 xl:col-span-10 h-full overflow-y-auto bg-slate-50" : "p-8 lg:col-span-9"}>

              {/* Top */}

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-3xl font-bold text-slate-900">
                    Fleet Overview
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Monitor operational performance in real time.
                  </p>

                </div>

                <button className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700">
                  Generate Report
                </button>

              </div>

              {/* KPI Cards */}

              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {fleetStats.map((stat) => {

                  const Icon = stat.icon;

                  return (

                    <div
                      key={stat.title}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-sm text-slate-500">
                            {stat.title}
                          </p>

                          <h3 className="mt-2 text-3xl font-bold text-slate-900">
                            {stat.value}
                          </h3>

                        </div>

                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl ${stat.bg}`}
                        >
                          <Icon
                            className={stat.color}
                            size={28}
                          />
                        </div>

                      </div>

                      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600">

                        <ArrowUpRight size={16} />

                        {stat.change}

                        <span className="text-slate-500">
                          this month
                        </span>

                      </div>

                    </div>

                  );

                })}

              </div>
                            {/* Charts + Fleet Table */}

              <div className="mt-8 grid gap-6 xl:grid-cols-3">

                {/* Fleet Performance */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

                  <div className="flex items-center justify-between">

                    <div>

                      <h4 className="text-lg font-semibold text-slate-900">
                        Fleet Performance
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Weekly utilization overview
                      </p>

                    </div>

                    <BarChart3 className="text-blue-600" />

                  </div>

                  <div className="mt-8 flex h-56 items-end justify-between gap-4">

                    {[45, 70, 55, 82, 74, 92, 86].map((value, index) => (
                      <div
                        key={index}
                        className="flex flex-1 flex-col items-center gap-3"
                      >
                        <div
                          className="w-full rounded-t-xl bg-blue-600 transition hover:bg-blue-500"
                          style={{
                            height: `${value * 2}px`,
                          }}
                        />

                        <span className="text-xs text-slate-500">
                          {
                            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                              index
                            ]
                          }
                        </span>
                      </div>
                    ))}

                  </div>

                </div>

                {/* Quick Analytics */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <h4 className="text-lg font-semibold text-slate-900">
                    Fleet Health
                  </h4>

                  <div className="mt-8 space-y-6">

                    <div>

                      <div className="mb-2 flex justify-between">

                        <span className="text-sm text-slate-600">
                          Vehicle Utilization
                        </span>

                        <span className="font-semibold">
                          94%
                        </span>

                      </div>

                      <div className="h-2 rounded-full bg-slate-100">

                        <div className="h-2 w-[94%] rounded-full bg-blue-600"></div>

                      </div>

                    </div>

                    <div>

                      <div className="mb-2 flex justify-between">

                        <span className="text-sm text-slate-600">
                          Driver Availability
                        </span>

                        <span className="font-semibold">
                          88%
                        </span>

                      </div>

                      <div className="h-2 rounded-full bg-slate-100">

                        <div className="h-2 w-[88%] rounded-full bg-emerald-500"></div>

                      </div>

                    </div>

                    <div>

                      <div className="mb-2 flex justify-between">

                        <span className="text-sm text-slate-600">
                          Fuel Efficiency
                        </span>

                        <span className="font-semibold">
                          91%
                        </span>

                      </div>

                      <div className="h-2 rounded-full bg-slate-100">

                        <div className="h-2 w-[91%] rounded-full bg-amber-500"></div>

                      </div>

                    </div>

                    <div>

                      <div className="mb-2 flex justify-between">

                        <span className="text-sm text-slate-600">
                          Compliance
                        </span>

                        <span className="font-semibold">
                          98%
                        </span>

                      </div>

                      <div className="h-2 rounded-full bg-slate-100">

                        <div className="h-2 w-[98%] rounded-full bg-indigo-500"></div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Vehicle Table */}

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-200 p-6">

                  <div>

                    <h4 className="text-lg font-semibold text-slate-900">
                      Active Fleet
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Real-time vehicle status
                    </p>

                  </div>

                  <Calendar className="text-slate-400" />

                </div>

                <div className="overflow-x-auto">

                  <table className="min-w-full">

                    <thead>

                      <tr className="bg-slate-50">

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Vehicle
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Driver
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Route
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {vehicles.map((vehicle) => (

                        <tr
                          key={vehicle.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >

                          <td className="px-6 py-4 font-medium text-slate-900">
                            {vehicle.id}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {vehicle.driver}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {vehicle.route}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                vehicle.status === "Running"
                                  ? "bg-green-100 text-green-700"
                                  : vehicle.status === "Maintenance"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {vehicle.status}
                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>
                            {/* Bottom Section */}

              <div className="mt-8 grid gap-6 lg:grid-cols-3">

                {/* Fuel Analytics */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <h4 className="text-lg font-semibold text-slate-900">
                        Fuel Analytics
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Consumption Overview
                      </p>

                    </div>

                    <Fuel className="text-blue-600" />

                  </div>

                  <div className="mt-8 space-y-5">

                    {[
                      { month: "January", value: "8,240 L" },
                      { month: "February", value: "7,980 L" },
                      { month: "March", value: "8,610 L" },
                    ].map((item) => (
                      <div
                        key={item.month}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                      >
                        <span className="font-medium text-slate-700">
                          {item.month}
                        </span>

                        <span className="font-semibold text-blue-600">
                          {item.value}
                        </span>
                      </div>
                    ))}

                  </div>

                </div>

                {/* Maintenance */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <h4 className="text-lg font-semibold text-slate-900">
                      Upcoming Maintenance
                    </h4>

                    <Wrench className="text-amber-500" />

                  </div>

                  <div className="mt-8 space-y-4">

                    {maintenance.map((item) => (

                      <div
                        key={item}
                        className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
                      >

                        <div className="rounded-lg bg-amber-100 p-2">
                          <Wrench
                            size={18}
                            className="text-amber-600"
                          />
                        </div>

                        <div>

                          <p className="font-medium text-slate-800">
                            {item}
                          </p>

                          <p className="text-sm text-slate-500">
                            Scheduled this week
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

                {/* Activity Feed */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <h4 className="text-lg font-semibold text-slate-900">
                      Recent Activity
                    </h4>

                    <Activity className="text-green-600" />

                  </div>

                  <div className="mt-8 space-y-6">

                    {[
                      {
                        icon: ShieldCheck,
                        title: "Vehicle Inspection Completed",
                        time: "10 min ago",
                        color: "text-emerald-600",
                        bg: "bg-emerald-100",
                      },
                      {
                        icon: Truck,
                        title: "Trip Assigned",
                        time: "35 min ago",
                        color: "text-blue-600",
                        bg: "bg-blue-100",
                      },
                      {
                        icon: Fuel,
                        title: "Fuel Log Updated",
                        time: "1 hour ago",
                        color: "text-amber-600",
                        bg: "bg-amber-100",
                      },
                    ].map((activity) => {
                      const Icon = activity.icon;

                      return (
                        <div
                          key={activity.title}
                          className="flex items-start gap-4"
                        >
                          <div
                            className={`rounded-xl p-3 ${activity.bg}`}
                          >
                            <Icon
                              size={18}
                              className={activity.color}
                            />
                          </div>

                          <div>

                            <p className="font-medium text-slate-800">
                              {activity.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {activity.time}
                            </p>

                          </div>

                        </div>
                      );
                    })}

                  </div>

                </div>

              </div>

              {/* Bottom KPI */}

              <div className="mt-8 grid gap-6 md:grid-cols-4">

                {[
                  {
                    title: "Fleet Utilization",
                    value: "94%",
                  },
                  {
                    title: "Driver Safety",
                    value: "98%",
                  },
                  {
                    title: "On-Time Delivery",
                    value: "96%",
                  },
                  {
                    title: "Customer Satisfaction",
                    value: "4.9/5",
                  },
                ].map((item) => (

                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-linear-to-br from -blue-600 to-blue-700 p-6 text-white shadow-lg"
                  >

                    <p className="text-sm text-blue-100">
                      {item.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold">
                      {item.value}
                    </h3>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}