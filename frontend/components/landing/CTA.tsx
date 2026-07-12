import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 px-8 py-16 shadow-2xl lg:px-16">

          {/* Decorative Background */}

          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid items-center gap-14 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="inline-flex items-center rounded-full bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-300">
                Ready to Transform Your Fleet?
              </span>

              <h2 className="mt-8 text-5xl font-bold leading-tight text-white">
                Manage Every Vehicle,
                <br />
                Driver & Trip
                <span className="text-blue-400"> From One Dashboard.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Streamline fleet operations with real-time monitoring,
                maintenance scheduling, trip management, analytics,
                and reporting—all in one enterprise-grade platform.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
                >
                  Get Started

                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="#features"
                  className="rounded-xl border border-slate-600 px-7 py-4 font-semibold text-white transition hover:border-blue-500"
                >
                  Explore Features
                </Link>

              </div>

            </div>

            {/* Right */}

            <div className="grid gap-6">

              <div className="rounded-2xl bg-white p-6 shadow-lg">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-blue-100 p-3">
                    <Truck
                      className="text-blue-600"
                      size={28}
                    />
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      Fleet Visibility
                    </h3>

                    <p className="text-sm text-slate-500">
                      Monitor every vehicle in real time.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-green-100 p-3">
                    <Users
                      className="text-green-600"
                      size={28}
                    />
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      Driver Management
                    </h3>

                    <p className="text-sm text-slate-500">
                      Assign drivers and monitor performance.
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-amber-100 p-3">
                    <ShieldCheck
                      className="text-amber-600"
                      size={28}
                    />
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      Secure & Reliable
                    </h3>

                    <p className="text-sm text-slate-500">
                      Enterprise-grade authentication and data security.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Bottom Trust Indicators */}

          <div className="relative z-10 mt-16 grid gap-6 border-t border-slate-700 pt-10 md:grid-cols-3">

            <div className="flex items-center gap-3 text-slate-300">

              <CheckCircle2
                className="text-green-400"
                size={20}
              />

              <span>99.9% System Availability</span>

            </div>

            <div className="flex items-center gap-3 text-slate-300">

              <CheckCircle2
                className="text-green-400"
                size={20}
              />

              <span>Enterprise Security Standards</span>

            </div>

            <div className="flex items-center gap-3 text-slate-300">

              <CheckCircle2
                className="text-green-400"
                size={20}
              />

              <span>Scalable Fleet Management Platform</span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}