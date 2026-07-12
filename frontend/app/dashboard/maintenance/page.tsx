"use client";

import { CheckCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Badge,
  DataTable,
  EmptyState,
  PageHeader,
  StatRow,
  Toolbar,
  type BadgeTone,
} from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  completeMaintenanceLog,
  createMaintenanceLog,
  fetchMaintenanceLogs,
  fetchVehicles,
  MaintenanceResponse,
} from "@/lib/api/transitops";
import { useAuth } from "@/lib/auth/auth-context";

const maintenanceSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  description: z.string().min(1, "Description is required"),
  cost: z.string().min(1, "Cost is required"),
  scheduled_date: z.string().min(1, "Scheduled date is required"),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

const toneMap: Record<string, BadgeTone> = {
  Scheduled: "muted",
  "In Progress": "default",
  Completed: "success",
  Overdue: "destructive",
};

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

function MaintenanceFormDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: MaintenanceFormValues) => void;
}) {
  const { data: vehicles } = useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles, enabled: open });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { vehicle_id: "", description: "", cost: "", scheduled_date: "" },
  });

  const submit = handleSubmit((values) => {
    onSubmit(values);
    reset();
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title="Log Maintenance" description="Schedule or record a maintenance work order for a vehicle." onClose={onClose} />
      <form onSubmit={submit}>
        <DialogBody>
          <div className="space-y-1.5">
            <Label htmlFor="maint_vehicle_id">Vehicle</Label>
            <Select id="maint_vehicle_id" {...register("vehicle_id")} aria-invalid={!!errors.vehicle_id}>
              <option value="">Select vehicle…</option>
              {vehicles?.map((v) => (
                <option key={v.id} value={v.id}>{v.model} ({v.registration_number})</option>
              ))}
            </Select>
            {errors.vehicle_id && <p className="text-xs text-destructive">{errors.vehicle_id.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maint_description">Service Description</Label>
            <Input id="maint_description" placeholder="e.g. Oil change, brake service…" {...register("description")} aria-invalid={!!errors.description} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="maint_cost">Estimated Cost (₹)</Label>
              <Input id="maint_cost" type="number" step="any" placeholder="e.g. 5000" {...register("cost")} aria-invalid={!!errors.cost} />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maint_date">Scheduled Date</Label>
              <Input id="maint_date" type="date" {...register("scheduled_date")} aria-invalid={!!errors.scheduled_date} />
              {errors.scheduled_date && <p className="text-xs text-destructive">{errors.scheduled_date.message}</p>}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Log Maintenance</Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default function MaintenancePage() {
  const { user } = useAuth();
  const isFleetManager = user?.role?.name === "Fleet Manager";
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const { data: logs = [], isLoading } = useQuery<MaintenanceResponse[]>({
    queryKey: ["maintenance"],
    queryFn: fetchMaintenanceLogs,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["maintenance"] });

  const createMutation = useMutation({
    mutationFn: createMaintenanceLog,
    onSuccess: () => { invalidate(); setFormOpen(false); },
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => completeMaintenanceLog(id),
    onSuccess: invalidate,
  });

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.description.toLowerCase().includes(q) || String(l.vehicle_id).includes(q);
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [logs, search, statusFilter]);

  const counts = useMemo(() => ({
    open: logs.filter((l) => l.status !== "Completed").length,
    scheduled: logs.filter((l) => l.status === "Scheduled").length,
    completed: logs.filter((l) => l.status === "Completed").length,
    totalCost: logs.reduce((sum, l) => sum + (l.cost ?? 0), 0),
  }), [logs]);

  function handleCreate(values: MaintenanceFormValues) {
    createMutation.mutate({
      vehicle_id: Number(values.vehicle_id),
      description: values.description,
      cost: parseFloat(values.cost),
      scheduled_date: values.scheduled_date,
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <p className="animate-pulse font-mono text-sm text-muted-foreground">Loading maintenance logs…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Maintenance" description="Work orders, service schedules, and vehicle downtime." />

      <StatRow
        stats={[
          { label: "Open Orders", value: String(counts.open).padStart(2, "0"), color: "border-primary" },
          { label: "Scheduled", value: String(counts.scheduled).padStart(2, "0"), color: "border-primary" },
          { label: "Completed", value: String(counts.completed).padStart(2, "0"), color: "border-success" },
          { label: "Total Cost", value: `₹${counts.totalCost.toLocaleString("en-IN")}`, color: "border-primary" },
        ]}
      />

      <div className="space-y-4">
        <Toolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by description or vehicle…"
          filters={[{ label: "Status", value: statusFilter, options: statusOptions, onChange: setStatusFilter }]}
          addLabel={isFleetManager ? "Log Maintenance" : undefined}
          onAdd={isFleetManager ? () => setFormOpen(true) : undefined}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No maintenance records found" description="Try adjusting your search or filters." />
        ) : (
          <DataTable
            columns={["#", "Vehicle ID", "Description", "Cost", "Scheduled", "Status", ...(isFleetManager ? [""] : [])]}
            rows={filtered.map((l) => [
              `WO-${l.id}`,
              l.vehicle_id,
              l.description,
              `₹${(l.cost ?? 0).toLocaleString("en-IN")}`,
              l.scheduled_date,
              <Badge key={`status-${l.id}`} tone={toneMap[l.status] ?? "default"}>{l.status}</Badge>,
              ...(isFleetManager ? [
                l.status !== "Completed" ? (
                  <Button
                    key={`complete-${l.id}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => completeMutation.mutate(l.id)}
                    disabled={completeMutation.isPending}
                  >
                    <CheckCircle className="mr-1 h-3.5 w-3.5" />
                    Mark Complete
                  </Button>
                ) : <span key={`done-${l.id}`} className="text-xs text-muted-foreground">Done</span>
              ] : []),
            ])}
          />
        )}
      </div>

      {isFleetManager && (
        <MaintenanceFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
