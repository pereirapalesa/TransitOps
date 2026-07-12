import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Truck,
  Route,
  ShieldCheck,
  BarChart3,
  Users,
  Wrench,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100 blur-3xl opacity-40" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        {/* Left Content */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            🚛 Modern Fleet Management Platform
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-slate-900 lg:text-6xl">
            Smarter Fleet Management for
            <span className="text-blue-600"> Modern Businesses.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Manage vehicles, drivers, trips, maintenance, fuel expenses,
            analytics, and operational performance from one centralized ERP
            platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow transition hover:bg-blue-700"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              href="#features"
              className="rounded-xl border border-slate-300 px-6 py-4 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
            >
              Explore Features
            </Link>
          </div>

          {/* Trust Points */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-slate-600">
                Real-time Fleet Monitoring
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-slate-600">
                Intelligent Trip Management
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-slate-600">
                Preventive Maintenance
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-slate-600">
                Analytics & Reports
              </span>
            </div>
          </div>
        </div>

        {/* Right Dashboard Mockup */}
        <div className="relative">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            {/* Top Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-5">
                <Truck className="mb-3 text-blue-600" size={28} />
                <p className="text-sm text-slate-500">Fleet Size</p>
                <h3 className="mt-1 text-3xl font-bold text-slate-900">
                  124
                </h3>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <Users className="mb-3 text-green-500" size={28} />
                <p className="text-sm text-slate-500">Drivers</p>
                <h3 className="mt-1 text-3xl font-bold text-slate-900">
                  89
                </h3>
              </div>
            </div>

            {/* Active Trips */}
            <div className="mt-6 rounded-xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-slate-900">
                  Active Trips
                </h4>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Live
                </span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    route: "Mumbai → Pune",
                    driver: "Rahul Sharma",
                  },
                  {
                    route: "Delhi → Jaipur",
                    driver: "Amit Patel",
                  },
                  {
                    route: "Bangalore → Mysore",
                    driver: "Neha Singh",
                  },
                ].map((trip) => (
                  <div
                    key={trip.route}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {trip.route}
                      </p>

                      <p className="text-sm text-slate-500">
                        {trip.driver}
                      </p>
                    </div>

                    <Route className="text-blue-600" size={20} />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <BarChart3
                  className="mx-auto text-blue-600"
                  size={24}
                />
                <p className="mt-2 text-xs text-slate-500">Efficiency</p>
                <h4 className="font-bold text-slate-900">92%</h4>
              </div>

              <div className="rounded-xl bg-green-50 p-4 text-center">
                <ShieldCheck
                  className="mx-auto text-green-600"
                  size={24}
                />
                <p className="mt-2 text-xs text-slate-500">Safety</p>
                <h4 className="font-bold text-slate-900">98%</h4>
              </div>

              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <Wrench
                  className="mx-auto text-amber-500"
                  size={24}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Maintenance
                </p>
                <h4 className="font-bold text-slate-900">12 Due</h4>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -right-6 -top-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg lg:block">
            <p className="text-sm text-slate-500">
              Fleet Utilization
            </p>

            <h3 className="mt-1 text-3xl font-bold text-blue-600">
              94%
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}