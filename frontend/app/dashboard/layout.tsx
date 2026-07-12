import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import Navbar from "@/components/landing/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
  <div className="flex flex-col h-screen overflow-hidden bg-[#ffffff]  text-black">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
