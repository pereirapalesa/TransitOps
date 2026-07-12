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

export default function Navbar() {
  return (
    <header className="w-full border-b border-border bg-panel">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M3 12h4l2-6h6l2 6h4M6 16h12M8 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM16 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-mono text-sm uppercase tracking-[0.22em] text-foreground">TransitOps</span>
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
      </div>
    </header>
  );
}
