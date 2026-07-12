"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import type { Vehicle } from "@/components/dashboard/VehicleCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { vehicleSchema, vehicleStatusValues, type VehicleFormValues } from "@/lib/validators/vehicle";

export function VehicleFormDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void;
  initialValues?: Vehicle;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialValues ?? { id: "", type: "", region: "", odometer: "", status: "Available" },
  });

  React.useEffect(() => {
    if (open) {
      reset(initialValues ?? { id: "", type: "", region: "", odometer: "", status: "Available" });
    }
  }, [open, initialValues, reset]);

  const submit = handleSubmit((values) => {
    onSubmit(values);
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title={initialValues ? "Edit Vehicle" : "Add Vehicle"}
        description="Fleet record for this vehicle."
        onClose={onClose}
      />
      <form onSubmit={submit}>
        <DialogBody>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="id">Vehicle ID</Label>
              <Input id="id" placeholder="e.g. VAN-05" {...register("id")} aria-invalid={!!errors.id} disabled={!!initialValues} />
              {errors.id ? <p className="text-xs text-destructive">{errors.id.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="type">Type</Label>
              <Input id="type" placeholder="e.g. Van" {...register("type")} aria-invalid={!!errors.type} />
              {errors.type ? <p className="text-xs text-destructive">{errors.type.message}</p> : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="region">Region</Label>
              <Input id="region" placeholder="e.g. Mumbai" {...register("region")} aria-invalid={!!errors.region} />
              {errors.region ? <p className="text-xs text-destructive">{errors.region.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="odometer">Odometer</Label>
              <Input id="odometer" placeholder="e.g. 84,210 km" {...register("odometer")} aria-invalid={!!errors.odometer} />
              {errors.odometer ? <p className="text-xs text-destructive">{errors.odometer.message}</p> : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...register("status")}>
              {vehicleStatusValues.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialValues ? "Save Changes" : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
