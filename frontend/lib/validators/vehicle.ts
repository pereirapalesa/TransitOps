import { z } from "zod";

export const vehicleStatusValues = ["Available", "On Trip", "Dispatched", "In Shop", "Retired"] as const;

export const vehicleSchema = z.object({
  id: z.string().min(1, "Vehicle ID is required"),
  type: z.string().min(1, "Vehicle type is required"),
  region: z.string().min(1, "Region is required"),
  odometer: z.string().min(1, "Odometer reading is required"),
  status: z.enum(vehicleStatusValues),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
