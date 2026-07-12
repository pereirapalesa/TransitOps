"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

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

const initialDrivers: Driver[] = [
  { name: "Alex Menezes", license: "MH-14 2031", vehicle: "VAN-05", trips: 214, status: "On Duty" },
  { name: "John Fernandes", license: "MH-12 5502", vehicle: "TRK-12", trips: 189, status: "Off Duty" },
  { name: "Priya Nair", license: "MH-01 8890", vehicle: "MINI-08", trips: 302, status: "On Duty" },
  { name: "Rahul Sharma", license: "DL-08 4471", vehicle: "\u2014", trips: 97, status: "Suspended" },
  { name: "Neha Singh", license: "KA-05 1123", vehicle: "TRK-03", trips: 156, status: "On Duty" },
];

const toneMap: Record<Driver["status"], BadgeTone> = {
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
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>(undefined);
  const [deletingDriver, setDeletingDriver] = useState<Driver | undefined>(undefined);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        search.trim().length === 0 ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.license.toLowerCase().includes(search.toLowerCase()) ||
        d.vehicle.toLowerCase().includes(search.toLowerCase());
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

  function handleEdit(driver: Driver) {
    setEditingDriver(driver);
    setFormOpen(true);
  }

  function handleSubmit(values: DriverFormValues) {
    if (editingDriver) {
      setDrivers((prev) => prev.map((d) => (d === editingDriver ? { ...d, ...values } : d)));
    } else {
      setDrivers((prev) => [...prev, { ...values, trips: 0 }]);
    }
  }

  function handleDelete() {
    if (!deletingDriver) return;
    setDrivers((prev) => prev.filter((d) => d !== deletingDriver));
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
          searchPlaceholder="Search by name, license, or vehicle…"
          filters={[{ label: "Status", value: statusFilter, options: statusOptions, onChange: setStatusFilter }]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          addLabel="Add Driver"
          onAdd={handleAdd}
        />

        {filteredDrivers.length === 0 ? (
          <EmptyState title="No drivers found" description="Try a different search term or status filter." />
        ) : viewMode === "table" ? (
          <DataTable
            columns={["Driver", "License", "Assigned Vehicle", "Trips Completed", "Status", ""]}
            rows={filteredDrivers.map((d) => [
              d.name,
              d.license,
              d.vehicle,
              d.trips,
              <Badge key={`${d.name}-status`} tone={toneMap[d.status]}>
                {d.status}
              </Badge>,
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
              </div>,
            ])}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.name}
                driver={driver}
                onEdit={() => handleEdit(driver)}
                onDelete={() => setDeletingDriver(driver)}
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
