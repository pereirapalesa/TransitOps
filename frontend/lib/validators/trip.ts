import { z } from "zod";

export const tripSchema = z.object({
  source: z.string().min(1, "Source location is required"),
  destination: z.string().min(1, "Destination location is required"),
  vehicle_id: z.string().min(1, "Vehicle is required"),
  driver_id: z.string().min(1, "Driver is required"),
  cargo_weight: z.string().min(1, "Cargo weight is required"),
  planned_distance: z.string().min(1, "Planned distance is required"),
  starting_odometer: z.string().min(1, "Starting odometer is required"),
});

export type TripFormValues = z.infer<typeof tripSchema>;
