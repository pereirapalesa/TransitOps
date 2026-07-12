"use client";

import { CheckCircle, Plus, Send, Trash2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import {
  Badge,
  DataTable,
  EmptyState,
  PageHeader,
  StatRow,
  Toolbar,
  type BadgeTone,
} from "@/components/dashboard/PageShell";
import { TripCompleteDialog } from "@/components/dashboard/TripCompleteDialog";
import { TripFormDialog } from "@/components/dashboard/TripFormDialog";
import { Button } from "@/components/ui/button";
import {
  cancelTrip,
  completeTrip,
  createTrip,
  deleteTrip,
  dispatchTrip,
  fetchTrips,
  TripResponse,
} from "@/lib/api/transitops";
import { useAuth } from "@/lib/auth/auth-context";
import type { TripFormValues } from "@/lib/validators/trip";

const toneMap: Record<string, BadgeTone> = {
  Draft: "muted",
  Dispatched: "default",
  Completed: "success",
  Cancelled: "destructive",
};

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "Draft" },
  { label: "Dispatched", value: "Dispatched" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function TripsPage() {
  const { user } = useAuth();
  const isFleetManager = user?.role?.name === "Fleet Manager";
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [completingTrip, setCompletingTrip] = useState<TripResponse | null>(null);
  const [cancellingTrip, setCancellingTrip] = useState<TripResponse | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<TripResponse | null>(null);

  const { data: trips = [], isLoading } = useQuery<TripResponse[]>({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["trips"] });

  const createMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: () => { invalidate(); setFormOpen(false); },
  });

  const dispatchMutation = useMutation({
    mutationFn: (id: number) => dispatchTrip(id),
    onSuccess: invalidate,
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, odo }: { id: number; odo: number }) => completeTrip(id, odo),
    onSuccess: () => { invalidate(); setCompletingTrip(null); },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelTrip(id),
    onSuccess: () => { invalidate(); setCancellingTrip(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTrip(id),
    onSuccess: () => { invalidate(); setDeletingTrip(null); },
  });

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.source.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        String(t.id).includes(q);
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [trips, search, statusFilter]);

  const counts = useMemo(() => ({
    draft: trips.filter((t) => t.status === "Draft").length,
    dispatched: trips.filter((t) => t.status === "Dispatched").length,
    completed: trips.filter((t) => t.status === "Completed").length,
    cancelled: trips.filter((t) => t.status === "Cancelled").length,
  }), [trips]);

  function handleCreate(values: TripFormValues) {
    createMutation.mutate({
      source: values.source,
      destination: values.destination,
      vehicle_id: Number(values.vehicle_id),
      driver_id: Number(values.driver_id),
      cargo_weight: parseFloat(values.cargo_weight),
      planned_distance: parseFloat(values.planned_distance),
      starting_odometer: parseFloat(values.starting_odometer),
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <p className="animate-pulse font-mono text-sm text-muted-foreground">Loading trips…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Trips" description="Active, dispatched, and completed trips across the fleet." />

      <StatRow
        stats={[
          { label: "Drafts", value: String(counts.draft).padStart(2, "0"), color: "border-primary" },
          { label: "Dispatched", value: String(counts.dispatched).padStart(2, "0"), color: "border-primary" },
          { label: "Completed", value: String(counts.completed).padStart(2, "0"), color: "border-success" },
          { label: "Cancelled", value: String(counts.cancelled).padStart(2, "0"), color: "border-destructive" },
        ]}
      />

      <div className="space-y-4">
        <Toolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by route or trip ID…"
          filters={[{ label: "Status", value: statusFilter, options: statusOptions, onChange: setStatusFilter }]}
          addLabel={isFleetManager ? "Create Trip" : undefined}
          onAdd={isFleetManager ? () => setFormOpen(true) : undefined}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No trips found" description="Try a different search or status filter." />
        ) : (
          <DataTable
            columns={["#", "Route", "Vehicle", "Driver", "Cargo (kg)", "Status", ...(isFleetManager ? ["Actions"] : [])]}
            rows={filtered.map((t) => [
              `TR-${String(t.id).padStart(4, "0")}`,
              `${t.source} → ${t.destination}`,
              t.vehicle_id,
              t.driver_id,
              t.cargo_weight,
              <Badge key={`status-${t.id}`} tone={toneMap[t.status] ?? "default"}>{t.status}</Badge>,
              ...(isFleetManager ? [
                <div key={`actions-${t.id}`} className="flex items-center gap-1">
                  {t.status === "Draft" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Dispatch"
                        onClick={() => dispatchMutation.mutate(t.id)}
                        disabled={dispatchMutation.isPending}
                      >
                        <Send className="mr-1 h-3.5 w-3.5" />
                        Dispatch
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete draft"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingTrip(t)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                  {t.status === "Dispatched" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Complete trip"
                        onClick={() => setCompletingTrip(t)}
                      >
                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                        Complete
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Cancel trip"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setCancellingTrip(t)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              ] : []),
            ])}
          />
        )}
      </div>

      {/* Create trip dialog */}
      <TripFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Complete trip dialog */}
      {completingTrip && (
        <TripCompleteDialog
          open={!!completingTrip}
          onClose={() => setCompletingTrip(null)}
          startingOdometer={completingTrip.starting_odometer}
          onSubmit={(odo) => completeMutation.mutate({ id: completingTrip.id, odo })}
        />
      )}

      {/* Cancel confirm dialog */}
      <ConfirmDialog
        open={!!cancellingTrip}
        onClose={() => setCancellingTrip(null)}
        onConfirm={() => cancellingTrip && cancelMutation.mutate(cancellingTrip.id)}
        title={`Cancel Trip TR-${String(cancellingTrip?.id ?? "").padStart(4, "0")}?`}
        description="This will cancel the dispatch and release the vehicle and driver. This action cannot be undone."
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={!!deletingTrip}
        onClose={() => setDeletingTrip(null)}
        onConfirm={() => deletingTrip && deleteMutation.mutate(deletingTrip.id)}
        title={`Delete draft TR-${String(deletingTrip?.id ?? "").padStart(4, "0")}?`}
        description="This will permanently delete the draft trip record."
      />
    </div>
  );
}
