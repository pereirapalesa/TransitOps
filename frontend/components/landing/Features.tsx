import {
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Fleet Management",
    description:
      "Manage your entire vehicle fleet with complete visibility, vehicle history, and lifecycle tracking.",
    icon: Truck,
  },
  {
    title: "Driver Management",
    description:
      "Store licenses, monitor driver performance, assign vehicles, and maintain compliance records.",
    icon: Users,
  },
  {
    title: "Trip Tracking",
    description:
      "Create trips, assign drivers, monitor active deliveries, and optimize route planning.",
    icon: Route,
  },
  {
    title: "Maintenance",
    description:
      "Schedule preventive maintenance, track repairs, and reduce vehicle downtime.",
    icon: Wrench,
  },
  {
    title: "Fuel & Expenses",
    description:
      "Monitor fuel consumption, operating expenses, and overall transportation costs.",
    icon: Fuel,
  },
  {
    title: "Reports & Analytics",
    description:
      "Interactive dashboards with KPIs, operational insights, and performance reports.",
    icon: BarChart3,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Everything You Need
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
            Powerful Modules Built For Modern Fleet Operations
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            TransitOps combines every aspect of transportation management into
            one centralized ERP platform, helping organizations streamline
            operations and improve efficiency.
          </p>
        </div>

        {/* Feature Grid */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-600">
                  <Icon
                    className="text-blue-600 group-hover:text-white"
                    size={28}
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <button className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-3">
                  Learn More
                  <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-24 rounded-3xl border border-blue-100 bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div>
              <h3 className="text-3xl font-bold text-slate-900">
                Manage your fleet from a single dashboard
              </h3>

              <p className="mt-4 max-w-2xl text-slate-600">
                Eliminate spreadsheets and disconnected tools. Gain real-time
                visibility into vehicles, drivers, maintenance schedules,
                expenses, and operational performance.
              </p>
            </div>

            <button className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700">
              Explore Platform
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}