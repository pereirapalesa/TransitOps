"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  ending_odometer: z.string().min(1, "Ending odometer is required"),
});

export function TripCompleteDialog({
  open,
  onClose,
  onSubmit,
  startingOdometer,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (endingOdometer: number) => void;
  startingOdometer: number;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ ending_odometer: string }>({
    resolver: zodResolver(schema),
    defaultValues: { ending_odometer: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ ending_odometer: "" });
    }
  }, [open, reset]);

  const submit = handleSubmit((values) => {
    const endOdo = parseFloat(values.ending_odometer) || 0;
    onSubmit(endOdo);
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title="Complete Trip"
        description="Enter the ending odometer reading to complete the trip and release the vehicle and driver."
        onClose={onClose}
      />
      <form onSubmit={submit}>
        <DialogBody className="space-y-4">
          <div>
            <Label>Starting Odometer</Label>
            <p className="mt-1 font-mono text-sm text-foreground">{startingOdometer} km</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ending_odometer">Ending Odometer Reading (km)</Label>
            <Input
              id="ending_odometer"
              type="number"
              step="any"
              placeholder={`e.g. must be >= ${startingOdometer}`}
              {...register("ending_odometer")}
              aria-invalid={!!errors.ending_odometer}
            />
            {errors.ending_odometer ? (
              <p className="text-xs text-destructive">{errors.ending_odometer.message}</p>
            ) : null}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Complete Trip
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
