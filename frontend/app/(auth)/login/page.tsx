"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Truck } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}

        <div className="hidden bg-slate-900 lg:flex flex-col justify-between p-16 text-white">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
                <Truck size={28} />
              </div>

              <div>

                <h1 className="text-2xl font-bold">
                  TransitOps
                </h1>

                <p className="text-slate-300">
                  Fleet Management ERP
                </p>

              </div>

            </div>

            <div className="mt-20">

              <span className="rounded-full bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-300">
                Enterprise Fleet Platform
              </span>

              <h2 className="mt-8 text-5xl font-bold leading-tight">
                Manage your entire fleet
                from one dashboard.
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                Track vehicles, manage drivers, monitor trips,
                schedule maintenance, and generate reports using
                one centralized platform.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-6">

            <div>

              <h3 className="text-3xl font-bold">
                500+
              </h3>

              <p className="mt-2 text-slate-400">
                Vehicles
              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold">
                10K+
              </h3>

              <p className="mt-2 text-slate-400">
                Trips
              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold">
                99.9%
              </h3>

              <p className="mt-2 text-slate-400">
                Uptime
              </p>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="text-center">

                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome Back
                </h2>

                <p className="mt-3 text-slate-500">
                  Sign in to continue to TransitOps
                </p>

              </div>

              <form className="mt-10 space-y-6">

                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-600"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex justify-between">

                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </Link>

                  </div>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-12 outline-none transition focus:border-blue-600"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Remember */}

                <div className="flex items-center justify-between">

                  <label className="flex items-center gap-2 text-sm text-slate-600">

                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    Remember me

                  </label>

                </div>

                {/* Login */}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign In
                </button>

              </form>

              <div className="my-8 flex items-center">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="mx-4 text-sm text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>

              <p className="mt-8 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Contact Administrator
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}