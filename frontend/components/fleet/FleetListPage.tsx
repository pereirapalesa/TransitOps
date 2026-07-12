"use client";

import { useState, useMemo } from "react";
import { Vehicle, VehicleStatus, SortColumn, SortDirection } from "@/types/vehicle";
import { MOCK_VEHICLES } from "@/lib/mockVehicles";
import FilterBar from "./FilterBar";
import FleetDataTable from "./FleetDataTable";

const PAGE_SIZE = 8;

export default function FleetListPage() {
  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");

  // Sort state
  const [sortColumn, setSortColumn] = useState<SortColumn>("vehicle_number");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Pagination state
  const [page, setPage] = useState(1);

  // Handle column sort — toggle direction if same column, reset to asc if new column
  function handleSort(column: SortColumn) {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(1);
  }

  // Handle filter changes — reset to page 1 whenever filters change
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: VehicleStatus | "all") {
    setStatusFilter(value);
    setPage(1);
  }

  // Filter + sort + paginate in memory (swap this for an API call later)
  const filteredAndSorted = useMemo<Vehicle[]>(() => {
    let result = [...MOCK_VEHICLES];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.vehicle_number.toLowerCase().includes(q) ||
          v.plate_number.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortColumn] ?? "";
      const bVal = (b as unknown as Record<string, unknown>)[sortColumn] ?? "";

      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, statusFilter, sortColumn, sortDirection]);

  // Paginate
  const total = filteredAndSorted.length;
  const paginated = filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Fleet</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor all vehicles in the fleet.
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* Table */}
      <FleetDataTable
        vehicles={paginated}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}