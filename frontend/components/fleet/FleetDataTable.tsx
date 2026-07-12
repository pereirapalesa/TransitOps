"use client";

import { Vehicle, SortColumn, SortDirection } from "@/types/vehicle";
import VehicleStatusBadge from "./VehicleStatusBadge";

interface Props {
  vehicles: Vehicle[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

function SortIcon({
  column,
  sortColumn,
  sortDirection,
}: {
  column: SortColumn;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}) {
  if (column !== sortColumn) {
    return <span className="ml-1 text-gray-300">↕</span>;
  }
  return (
    <span className="ml-1 text-blue-500">
      {sortDirection === "asc" ? "↑" : "↓"}
    </span>
  );
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const COLUMNS: { key: SortColumn | null; label: string }[] = [
  { key: "vehicle_number", label: "Vehicle No." },
  { key: "type", label: "Type" },
  { key: null, label: "Driver" },
  { key: "status", label: "Status" },
  { key: "last_trip_date", label: "Last Trip" },
  { key: "mileage", label: "Mileage (km)" },
  { key: null, label: "Actions" },
];

export default function FleetDataTable({
  vehicles,
  sortColumn,
  sortDirection,
  onSort,
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  onClick={() => col.key && onSort(col.key)}
                  className={`px-4 py-3 text-left font-semibold ${
                    col.key ? "cursor-pointer select-none hover:text-gray-700" : ""
                  }`}
                >
                  {col.label}
                  {col.key && (
                    <SortIcon
                      column={col.key}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  No vehicles found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-blue-600">
                    <div>{vehicle.vehicle_number}</div>
                    <div className="text-xs text-gray-400">{vehicle.plate_number}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{vehicle.type}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {vehicle.driver_name ?? (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <VehicleStatusBadge status={vehicle.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {vehicle.last_trip_date
                      ? formatDate(vehicle.last_trip_date)
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {vehicle.mileage.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        title="View"
                        onClick={() => alert(`Viewing vehicle ${vehicle.vehicle_number}`)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        title="Edit"
                        onClick={() => alert(`Editing vehicle ${vehicle.vehicle_number}`)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 0 1 2.828 0l.172.172a2 2 0 0 1 0 2.828L12 16H9v-3z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {total === 0
            ? "No results"
            : `Showing ${start}–${end} of ${total} vehicles`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2)
            .map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  p === page
                    ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}