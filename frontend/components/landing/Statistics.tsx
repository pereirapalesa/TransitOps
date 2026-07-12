import {
  ArrowUpRight,
  Building2,
  Clock3,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";

const stats = [
  {
    title: "Trips Completed",
    value: "10,500+",
    description: "Successfully managed deliveries across multiple regions.",
    icon: Route,
  },
  {
    title: "Fleet Vehicles",
    value: "500+",
    description: "Commercial trucks, vans and transport vehicles monitored.",
    icon: Truck,
  },
  {
    title: "Enterprise Clients",
    value: "50+",
    description: "Businesses relying on TransitOps every single day.",
    icon: Building2,
  },
  {
    title: "System Uptime",
    value: "99.9%",
    description: "Reliable cloud infrastructure with uninterrupted access.",
    icon: Clock3,
  },
];

const achievements = [
  "Real-time Fleet Tracking",
  "Predictive Maintenance",
  "Fuel Cost Optimization",
  "Driver Performance Monitoring",
  "Advanced Analytics",
  "Role-Based Access Control",
];

export default function Statistics() {
  return (
    <section
      id="analytics"
      className="bg-slate-50 py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Trusted by Growing Businesses
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Numbers That Reflect Operational Excellence
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            TransitOps helps organizations reduce operational costs,
            improve fleet utilization, and deliver better transportation
            services through intelligent fleet management.
          </p>

        </div>

        {/* Statistics Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="flex items-center justify-between">

                  <div className="rounded-xl bg-blue-50 p-4">
                    <Icon
                      size={30}
                      className="text-blue-600"
                    />
                  </div>

                  <ArrowUpRight className="text-green-500" />

                </div>

                <h3 className="mt-8 text-4xl font-bold text-slate-900">
                  {item.value}
                </h3>

                <h4 className="mt-3 text-lg font-semibold text-slate-800">
                  {item.title}
                </h4>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>

              </div>

            );

          })}

        </div>

        {/* Achievement Section */}

        <div className="mt-24 grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <div>

            <h3 className="text-3xl font-bold text-slate-900">
              Why Businesses Choose TransitOps
            </h3>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Designed for logistics companies, fleet operators,
              transport businesses, and enterprises looking to
              centralize operations while improving efficiency.
            </p>

            <div className="mt-10 space-y-5">

              {achievements.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <div className="rounded-full bg-green-100 p-2">

                    <ShieldCheck
                      size={18}
                      className="text-green-600"
                    />

                  </div>

                  <span className="text-slate-700 font-medium">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Right */}

          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">

            <h4 className="text-2xl font-bold text-slate-900">
              Fleet Performance Overview
            </h4>

            <div className="mt-10 space-y-8">

              {[
                {
                  label: "Fleet Utilization",
                  value: 94,
                  color: "bg-blue-600",
                },
                {
                  label: "Driver Productivity",
                  value: 89,
                  color: "bg-emerald-500",
                },
                {
                  label: "Fuel Efficiency",
                  value: 91,
                  color: "bg-amber-500",
                },
                {
                  label: "Vehicle Health",
                  value: 97,
                  color: "bg-indigo-500",
                },
              ].map((progress) => (

                <div key={progress.label}>

                  <div className="mb-3 flex justify-between">

                    <span className="font-medium text-slate-700">
                      {progress.label}
                    </span>

                    <span className="font-semibold text-slate-900">
                      {progress.value}%
                    </span>

                  </div>

                  <div className="h-3 rounded-full bg-slate-100">

                    <div
                      className={`h-3 rounded-full ${progress.color}`}
                      style={{
                        width: `${progress.value}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}