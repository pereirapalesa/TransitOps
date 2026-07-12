"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import type { Driver } from "@/components/dashboard/DriverCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { driverSchema, driverStatusValues, type DriverFormValues } from "@/lib/validators/driver";

export function DriverFormDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DriverFormValues) => void;
  initialValues?: Driver;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: initialValues ?? { name: "", license: "", vehicle: "", status: "On Duty" },
  });

  React.useEffect(() => {
    if (open) {
      reset(initialValues ?? { name: "", license: "", vehicle: "", status: "On Duty" });
    }
  }, [open, initialValues, reset]);

  const submit = handleSubmit((values) => {
    onSubmit(values);
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title={initialValues ? "Edit Driver" : "Add Driver"}
        description="Roster details for this driver."
        onClose={onClose}
      />
      <form onSubmit={submit}>
        <DialogBody>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="e.g. Alex Menezes" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="license">License number</Label>
            <Input id="license" placeholder="e.g. MH-14 2031" {...register("license")} aria-invalid={!!errors.license} />
            {errors.license ? <p className="text-xs text-destructive">{errors.license.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vehicle">Assigned vehicle</Label>
              <Input id="vehicle" placeholder="e.g. VAN-05 or \u2014" {...register("vehicle")} aria-invalid={!!errors.vehicle} />
              {errors.vehicle ? <p className="text-xs text-destructive">{errors.vehicle.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register("status")}>
                {driverStatusValues.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialValues ? "Save Changes" : "Add Driver"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
