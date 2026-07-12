"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { tripSchema, type TripFormValues } from "@/lib/validators/trip";
import { fetchVehicles, fetchDrivers } from "@/lib/api/transitops";

export function TripFormDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TripFormValues) => void;
  initialValues?: any;
}) {
  const { data: vehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
    enabled: open,
  });

  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: initialValues ?? {
      source: "",
      destination: "",
      vehicle_id: "",
      driver_id: "",
      cargo_weight: "",
      planned_distance: "",
      starting_odometer: "",
    },
  });

  const selectedVehicleId = watch("vehicle_id");

  // Autofill odometer when vehicle is selected
  React.useEffect(() => {
    if (selectedVehicleId && vehicles) {
      const vehicle = vehicles.find((v) => String(v.id) === String(selectedVehicleId));
      if (vehicle) {
        setValue("starting_odometer", String(vehicle.odometer));
      }
    }
  }, [selectedVehicleId, vehicles, setValue]);

  React.useEffect(() => {
    if (open) {
      reset(initialValues ?? {
        source: "",
        destination: "",
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        planned_distance: "",
        starting_odometer: "",
      });
    }
  }, [open, initialValues, reset]);

  const submit = handleSubmit((values) => {
    onSubmit(values);
    onClose();
  });

  // Filter for available vehicles (or include the current one)
  const availableVehicles = React.useMemo(() => {
    if (!vehicles) return [];
    return vehicles.filter(
      (v) =>
        v.status === "Available" ||
        (initialValues && String(v.id) === String(initialValues.vehicle_id))
    );
  }, [vehicles, initialValues]);

  // Filter for available drivers (or include the current one)
  const availableDrivers = React.useMemo(() => {
    if (!drivers) return [];
    return drivers.filter(
      (d) =>
        d.status === "Available" ||
        (initialValues && String(d.id) === String(initialValues.driver_id))
    );
  }, [drivers, initialValues]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title={initialValues ? "Edit Trip" : "Create Trip"}
        description="Draft operational parameters for this trip dispatch."
        onClose={onClose}
      />
      <form onSubmit={submit}>
        <DialogBody>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="source">Source Location</Label>
              <Input
                id="source"
                placeholder="e.g. Mumbai"
                {...register("source")}
                aria-invalid={!!errors.source}
              />
              {errors.source ? (
                <p className="text-xs text-destructive">{errors.source.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="destination">Destination Location</Label>
              <Input
                id="destination"
                placeholder="e.g. Pune"
                {...register("destination")}
                aria-invalid={!!errors.destination}
              />
              {errors.destination ? (
                <p className="text-xs text-destructive">{errors.destination.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vehicle_id">Vehicle</Label>
              <Select id="vehicle_id" {...register("vehicle_id")} aria-invalid={!!errors.vehicle_id}>
                <option value="">Select vehicle...</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.model} ({v.registration_number}) - Odo: {v.odometer} km
                  </option>
                ))}
              </Select>
              {errors.vehicle_id ? (
                <p className="text-xs text-destructive">{errors.vehicle_id.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="driver_id">Driver</Label>
              <Select id="driver_id" {...register("driver_id")} aria-invalid={!!errors.driver_id}>
                <option value="">Select driver...</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.license_number})
                  </option>
                ))}
              </Select>
              {errors.driver_id ? (
                <p className="text-xs text-destructive">{errors.driver_id.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cargo_weight">Cargo (kg)</Label>
              <Input
                id="cargo_weight"
                type="number"
                step="any"
                placeholder="e.g. 500"
                {...register("cargo_weight")}
                aria-invalid={!!errors.cargo_weight}
              />
              {errors.cargo_weight ? (
                <p className="text-xs text-destructive">{errors.cargo_weight.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="planned_distance">Distance (km)</Label>
              <Input
                id="planned_distance"
                type="number"
                step="any"
                placeholder="e.g. 150"
                {...register("planned_distance")}
                aria-invalid={!!errors.planned_distance}
              />
              {errors.planned_distance ? (
                <p className="text-xs text-destructive">{errors.planned_distance.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="starting_odometer">Starting Odometer</Label>
              <Input
                id="starting_odometer"
                type="number"
                step="any"
                placeholder="e.g. 12000"
                {...register("starting_odometer")}
                aria-invalid={!!errors.starting_odometer}
              />
              {errors.starting_odometer ? (
                <p className="text-xs text-destructive">{errors.starting_odometer.message}</p>
              ) : null}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialValues ? "Save Changes" : "Create Trip"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
