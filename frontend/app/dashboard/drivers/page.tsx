"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import type { Driver } from "@/components/dashboard/DriverCard";
import { DriverCard } from "@/components/dashboard/DriverCard";
import { DriverFormDialog } from "@/components/dashboard/DriverFormDialog";
import {
  Badge,
  DataTable,
  EmptyState,
  PageHeader,
  StatRow,
  Toolbar,
  type BadgeTone,
  type ViewMode,
} from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import type { DriverFormValues } from "@/lib/validators/driver";
import {
  fetchDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  DriverResponse,
} from "@/lib/api/transitops";
import { useAuth } from "@/lib/auth/auth-context";

const toneMap: Record<string, BadgeTone> = {
  "On Duty": "success",
  "Off Duty": "muted",
  Suspended: "destructive",
};

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "On Duty", value: "On Duty" },
  { label: "Off Duty", value: "Off Duty" },
  { label: "Suspended", value: "Suspended" },
];

export default function DriversPage() {
  const { user } = useAuth();
  const isFleetManager = user?.role?.name === "Fleet Manager";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(undefined);
  const [deletingDriver, setDeletingDriver] = useState<any>(undefined);

  // Fetch drivers from backend
  const { data: dbDrivers, isLoading, refetch } = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
  });

  const createMutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      refetch();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateDriver(id, payload),
    onSuccess: () => {
      refetch();
      setEditingDriver(undefined);
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      refetch();
      setDeletingDriver(undefined);
    },
  });

  // Map backend format to frontend UI format
  const drivers = useMemo<any[]>(() => {
    if (!dbDrivers) return [];
    return dbDrivers.map((d: DriverResponse) => {
      let uiStatus = "Off Duty";
      if (d.status === "Available" || d.status === "On Trip" || d.status === "OnTrip") {
        uiStatus = "On Duty";
      } else if (d.status === "Suspended") {
        uiStatus = "Suspended";
      }

      return {
        id: d.id,
        name: d.name,
        license: d.license_number,
        vehicle: "—", // Default vehicle string
        trips: 0, // Default trips count
        status: uiStatus,
        rawStatus: d.status,
      };
    });
  }, [dbDrivers]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        search.trim().length === 0 ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.license.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  const counts = useMemo(
    () => ({
      total: drivers.length,
      onDuty: drivers.filter((d) => d.status === "On Duty").length,
      offDuty: drivers.filter((d) => d.status === "Off Duty").length,
      suspended: drivers.filter((d) => d.status === "Suspended").length,
    }),
    [drivers]
  );

  function handleAdd() {
    setEditingDriver(undefined);
    setFormOpen(true);
  }

  function handleEdit(driver: any) {
    setEditingDriver(driver);
    setFormOpen(true);
  }

  function handleSubmit(values: DriverFormValues) {
    let backendStatus = "Available";
    if (values.status === "Off Duty") {
      backendStatus = "Off Duty";
    } else if (values.status === "Suspended") {
      backendStatus = "Suspended";
    }

    const payload = {
      name: values.name,
      license_number: values.license,
      license_category: "Class A",
      license_expiry_date: "2028-12-31", // Default expiry
      contact_number: "+91-9999999999", // Default contact
      safety_score: 100.0,
      status: backendStatus,
    };

    if (editingDriver) {
      updateMutation.mutate({ id: editingDriver.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleDelete() {
    if (!deletingDriver) return;
    deleteMutation.mutate(deletingDriver.id);
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading drivers list…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Drivers" description="Roster, license status, and duty state for every driver." />

      <StatRow
        stats={[
          { label: "Total Drivers", value: String(counts.total).padStart(2, "0"), color: "border-primary" },
          { label: "On Duty", value: String(counts.onDuty).padStart(2, "0"), color: "border-success" },
          { label: "Off Duty", value: String(counts.offDuty).padStart(2, "0"), color: "border-primary" },
          { label: "Suspended", value: String(counts.suspended).padStart(2, "0"), color: "border-destructive" },
        ]}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Roster</h2>
        </div>

        <Toolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or license…"
          filters={[{ label: "Status", value: statusFilter, options: statusOptions, onChange: setStatusFilter }]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addLabel={isFleetManager ? "Add Driver" : undefined}
          onAdd={isFleetManager ? handleAdd : undefined}
        />

        {filteredDrivers.length === 0 ? (
          <EmptyState title="No drivers found" description="Try a different search term or status filter." />
        ) : viewMode === "table" ? (
          <DataTable
            columns={["Driver", "License", "Status", ""]}
            rows={filteredDrivers.map((d) => [
              d.name,
              d.license,
              <Badge key={`${d.name}-status`} tone={toneMap[d.status] ?? "default"}>
                {d.status}
              </Badge>,
              isFleetManager ? (
                <div key={`${d.name}-actions`} className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" aria-label={`Edit ${d.name}`} onClick={() => handleEdit(d)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${d.name}`}
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setDeletingDriver(d)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : null,
            ])}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.name}
                driver={driver}
                onEdit={isFleetManager ? () => handleEdit(driver) : undefined}
                onDelete={isFleetManager ? () => setDeletingDriver(driver) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <DriverFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingDriver}
      />

      <ConfirmDialog
        open={!!deletingDriver}
        onClose={() => setDeletingDriver(undefined)}
        onConfirm={handleDelete}
        title={`Remove ${deletingDriver?.name ?? "driver"}?`}
        description="This will remove the driver from the roster. This action cannot be undone."
      />
    </div>
  );
}
