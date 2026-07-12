import { z } from "zod";

export const driverStatusValues = ["On Duty", "Off Duty", "Suspended"] as const;

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  license: z.string().min(1, "License number is required"),
  vehicle: z.string().min(1, "Assigned vehicle is required (use \u2014 if none)"),
  status: z.enum(driverStatusValues),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
