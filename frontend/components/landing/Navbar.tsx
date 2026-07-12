"use client";

import Link from "next/link";
import { Menu, Truck, X, Moon } from "lucide-react";
import { useState } from "react";


export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Analytics", href: "/#analytics" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Truck size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              TransitOps
            </h1>
            <p className="-mt-1 text-xs text-slate-500">
              Fleet Management ERP
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
         
          <div className="flex items-center gap-3">

            <button
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100"
              aria-label="Toggle theme"
            >
              <Moon className="h-5 w-5 text-slate-600" />
            </button>

            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Login
            </Link>

          </div>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-slate-700" />
          ) : (
            <Menu className="h-6 w-6 text-slate-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="space-y-2 px-6 py-6">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 px-4 py-3 text-center font-medium text-slate-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}