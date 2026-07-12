export type VehicleStatus = "active" | "inactive" | "maintenance";

export interface Vehicle {
  id: number;
  vehicle_number: string;
  plate_number: string;
  type: string;
  driver_name: string | null;
  status: VehicleStatus;
  last_trip_date: string | null;
  mileage: number;
}

export interface VehicleListResponse {
  data: Vehicle[];
  total: number;
  page: number;
  page_size: number;
}

export type SortColumn =
  | "vehicle_number"
  | "type"
  | "status"
  | "mileage"
  | "last_trip_date";

export type SortDirection = "asc" | "desc";