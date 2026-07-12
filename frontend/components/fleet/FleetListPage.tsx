"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SortColumn, SortDirection } from "@/types/vehicle";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  VehicleResponse,
} from "@/lib/api/transitops";
import { useAuth } from "@/lib/auth/auth-context";
import { VehicleFormDialog } from "@/components/dashboard/VehicleFormDialog";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Button } from "@/components/ui/button";
import FilterBar from "./FilterBar";
import FleetDataTable from "./FleetDataTable";

const PAGE_SIZE = 8;

export default function FleetListPage() {
  const { user } = useAuth();
  const isFleetManager = user?.role?.name === "Fleet Manager";

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Sort state
  const [sortColumn, setSortColumn] = useState<SortColumn>("vehicle_number");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Pagination state
  const [page, setPage] = useState(1);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(undefined);
  const [deletingVehicle, setDeletingVehicle] = useState<any>(undefined);

  // Fetch vehicles
  const { data: dbVehicles, isLoading, refetch } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
  });

  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      refetch();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateVehicle(id, payload),
    onSuccess: () => {
      refetch();
      setEditingVehicle(undefined);
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      refetch();
      setDeletingVehicle(undefined);
    },
  });

  // Handle column sort
  function handleSort(column: SortColumn) {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(1);
  }

  // Handle filter changes
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleAdd() {
    setEditingVehicle(undefined);
    setFormOpen(true);
  }

  function handleEdit(vehicle: any) {
    setEditingVehicle(vehicle);
    setFormOpen(true);
  }

  function handleSubmit(values: any) {
    const numericOdometer = parseFloat(String(values.odometer).replace(/[^\d.]/g, "")) || 0;
    const payload = {
      registration_number: values.id,
      model: values.region, // store region in model field for simplicity
      type: values.type,
      max_load_capacity: 1500.0,
      odometer: numericOdometer,
      acquisition_cost: 30000.0,
      status: values.status,
    };

    if (editingVehicle) {
      updateMutation.mutate({ id: editingVehicle.dbId, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleDelete() {
    if (!deletingVehicle) return;
    deleteMutation.mutate(deletingVehicle.dbId);
  }

  // Map backend format to frontend UI format
  const mappedVehicles = useMemo(() => {
    if (!dbVehicles) return [];
    return dbVehicles.map((v: VehicleResponse) => {
      // Map API status to UI StatusBadge values: Available, On Trip, In Shop, Retired
      let mappedStatus = "Available";
      if (v.status === "On Trip" || v.status === "OnTrip") mappedStatus = "On Trip";
      else if (v.status === "In Shop" || v.status === "InShop") mappedStatus = "In Shop";
      else if (v.status === "Retired") mappedStatus = "Retired";

      // Map UI Status badge colors to: active (Available/On Trip), inactive (Retired), maintenance (In Shop)
      let uiStatus: "active" | "inactive" | "maintenance" = "active";
      if (mappedStatus === "Retired") uiStatus = "inactive";
      else if (mappedStatus === "In Shop") uiStatus = "maintenance";

      return {
        id: v.id,
        dbId: v.id,
        vehicle_number: v.registration_number,
        plate_number: v.registration_number,
        type: v.type,
        driver_name: null,
        status: uiStatus,
        last_trip_date: null,
        mileage: v.odometer,
        rawStatus: mappedStatus,
        rawModel: v.model,
      };
    });
  }, [dbVehicles]);

  // Filter + sort + paginate
  const filteredAndSorted = useMemo(() => {
    let result = [...mappedVehicles];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.vehicle_number.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = (a as any)[sortColumn] ?? "";
      const bVal = (b as any)[sortColumn] ?? "";

      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [mappedVehicles, search, statusFilter, sortColumn, sortDirection]);

  // Paginate
  const total = filteredAndSorted.length;
  const paginated = filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const initialFormValues = useMemo(() => {
    if (!editingVehicle) return undefined;
    return {
      id: editingVehicle.vehicle_number,
      type: editingVehicle.type,
      region: editingVehicle.rawModel,
      odometer: String(editingVehicle.mileage),
      status: editingVehicle.rawStatus as any,
    };
  }, [editingVehicle]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading fleet roster…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Fleet</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all vehicles in the fleet.
          </p>
        </div>
        {isFleetManager && (
          <Button onClick={handleAdd}>Add Vehicle</Button>
        )}
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter as any}
        onStatusFilterChange={handleStatusFilterChange as any}
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
        onEdit={handleEdit}
        onDelete={(v) => setDeletingVehicle(v)}
        showActions={isFleetManager}
      />

      <VehicleFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialValues={initialFormValues as any}
      />

      <ConfirmDialog
        open={!!deletingVehicle}
        onClose={() => setDeletingVehicle(undefined)}
        onConfirm={handleDelete}
        title={`Remove vehicle ${deletingVehicle?.vehicle_number}?`}
        description="This will remove the vehicle from the fleet roster. This action cannot be undone."
      />
    </div>
  );
}