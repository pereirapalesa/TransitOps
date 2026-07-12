"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Fleet", href: "/dashboard/fleet" },
    { name: "Drivers", href: "/dashboard/drivers" },
    { name: "Trips", href: "/dashboard/trips" },
    { name: "Maintenance", href: "/dashboard/maintenance" },
    { name: "Fuel & Expenses", href: "/dashboard/fuel" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 bg-[#111318] border-r border-[#2a2e37] hidden md:flex flex-col h-full shrink-0 font-sans">
      <div className="p-6 h-20 flex items-center border-b border-[#2a2e37]">
        <h1 className="text-2xl font-semibold text-white tracking-tight">TransitOps</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white bg-[#1a1d24] border-l-2 border-orange-500"
                      : "text-[#8b949e] hover:text-white hover:bg-[#1a1d24] border-l-2 border-transparent"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
