"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleStatus } from "@/types/vehicle";

const STATUS_OPTIONS: { value: VehicleStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "In Maintenance" },
];

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: VehicleStatus | "all";
  onStatusFilterChange: (value: VehicleStatus | "all") => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search input */}
      <div className="relative w-full sm:max-w-xs">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search by vehicle or plate..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as VehicleStatus | "all")
          }
          className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Add Vehicle button — uses the project's existing Button component */}
        <Button>
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>
    </div>
  );
}