"use client";

import { useAuth } from "@/lib/auth/auth-context";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-[#111318] border-b border-[#2a2e37] px-8 flex items-center justify-between shrink-0 font-sans">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#1a1d24] border border-[#2a2e37] rounded-lg px-4 py-2 text-sm text-white placeholder-[#5b6470] focus:outline-none focus:border-blue-500 w-80 transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium text-white">{user.full_name}</span>
            <div className="flex items-center gap-2 bg-[#1a1d24] border border-[#2a2e37] rounded-full pl-3 pr-1 py-1 cursor-pointer hover:bg-[#20242c] transition-colors" onClick={() => void logout()}>
              <span className="text-xs text-blue-400 font-medium px-1">
                {user.role.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#2a2e37] flex items-center justify-center text-xs font-semibold text-white">
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-white">Raven K.</span>
            <div className="flex items-center gap-2 bg-[#1a1d24] border border-[#2a2e37] rounded-full pl-3 pr-1 py-1 cursor-pointer hover:bg-[#20242c] transition-colors">
              <span className="text-xs text-blue-400 font-medium px-1">
                Dispatcher
              </span>
              <div className="w-8 h-8 rounded-full bg-[#2a2e37] flex items-center justify-center text-xs font-semibold text-white">
                RK
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
