import { apiClient } from "@/lib/api/client";

// --- VEHICLES ---
export interface VehiclePayload {
  registration_number: string;
  model: string;
  type: string;
  max_load_capacity: number;
  odometer: number;
  acquisition_cost: number;
  status?: string;
}

export interface VehicleResponse extends VehiclePayload {
  id: number;
  created_at: string;
  updated_at: string;
}

export async function fetchVehicles(): Promise<VehicleResponse[]> {
  const { data } = await apiClient.get<VehicleResponse[]>("/vehicles");
  return data;
}

export async function fetchVehicle(id: number): Promise<VehicleResponse> {
  const { data } = await apiClient.get<VehicleResponse>(`/vehicles/${id}`);
  return data;
}

export async function createVehicle(payload: VehiclePayload): Promise<VehicleResponse> {
  const { data } = await apiClient.post<VehicleResponse>("/vehicles", payload);
  return data;
}

export async function updateVehicle(id: number, payload: Partial<VehiclePayload>): Promise<VehicleResponse> {
  const { data } = await apiClient.put<VehicleResponse>(`/vehicles/${id}`, payload);
  return data;
}

export async function deleteVehicle(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/vehicles/${id}`);
  return data;
}

// --- DRIVERS ---
export interface DriverPayload {
  name: string;
  license_number: string;
  license_category: string;
  license_expiry_date: string; // YYYY-MM-DD
  contact_number: string;
  safety_score?: number;
  status?: string;
}

export interface DriverResponse extends DriverPayload {
  id: number;
  created_at: string;
  updated_at: string;
}

export async function fetchDrivers(): Promise<DriverResponse[]> {
  const { data } = await apiClient.get<DriverResponse[]>("/drivers");
  return data;
}

export async function fetchAvailableDrivers(): Promise<DriverResponse[]> {
  const { data } = await apiClient.get<DriverResponse[]>("/drivers/available");
  return data;
}

export async function createDriver(payload: DriverPayload): Promise<DriverResponse> {
  const { data } = await apiClient.post<DriverResponse>("/drivers", payload);
  return data;
}

export async function updateDriver(id: number, payload: Partial<DriverPayload>): Promise<DriverResponse> {
  const { data } = await apiClient.put<DriverResponse>(`/drivers/${id}`, payload);
  return data;
}

export async function deleteDriver(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/drivers/${id}`);
  return data;
}

// --- TRIPS ---
export interface TripPayload {
  source: string;
  destination: string;
  vehicle_id: number;
  driver_id: number;
  cargo_weight: number;
  planned_distance: number;
  starting_odometer: number;
}

export interface TripResponse extends TripPayload {
  id: number;
  status: string;
  dispatch_time: string | null;
  completion_time: string | null;
  ending_odometer: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export async function fetchTrips(): Promise<TripResponse[]> {
  const { data } = await apiClient.get<TripResponse[]>("/trips");
  return data;
}

export async function createTrip(payload: TripPayload): Promise<TripResponse> {
  const { data } = await apiClient.post<TripResponse>("/trips", payload);
  return data;
}

export async function updateTrip(id: number, payload: Partial<TripPayload> & { status?: string }): Promise<TripResponse> {
  const { data } = await apiClient.put<TripResponse>(`/trips/${id}`, payload);
  return data;
}

export async function deleteTrip(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/trips/${id}`);
  return data;
}

export async function dispatchTrip(id: number): Promise<TripResponse> {
  const { data } = await apiClient.post<TripResponse>(`/trips/${id}/dispatch`);
  return data;
}

export async function completeTrip(id: number, endingOdometer: number): Promise<TripResponse> {
  const { data } = await apiClient.post<TripResponse>(`/trips/${id}/complete`, { ending_odometer: endingOdometer });
  return data;
}

export async function cancelTrip(id: number): Promise<TripResponse> {
  const { data } = await apiClient.post<TripResponse>(`/trips/${id}/cancel`);
  return data;
}

// --- MAINTENANCE ---
export interface MaintenancePayload {
  vehicle_id: number;
  description: string;
  cost: number;
  scheduled_date: string; // YYYY-MM-DD
}

export interface MaintenanceResponse extends MaintenancePayload {
  id: number;
  status: string;
  actual_completion_date: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export async function fetchMaintenanceLogs(): Promise<MaintenanceResponse[]> {
  const { data } = await apiClient.get<MaintenanceResponse[]>("/maintenance");
  return data;
}

export async function createMaintenanceLog(payload: MaintenancePayload): Promise<MaintenanceResponse> {
  const { data } = await apiClient.post<MaintenanceResponse>("/maintenance", payload);
  return data;
}

export async function completeMaintenanceLog(id: number): Promise<MaintenanceResponse> {
  const { data } = await apiClient.post<MaintenanceResponse>(`/maintenance/${id}/complete`);
  return data;
}

// --- FUEL LOGS ---
export interface FuelLogPayload {
  vehicle_id: number;
  fuel_quantity: number;
  cost: number;
  odometer: number;
  fill_date: string; // YYYY-MM-DD
}

export interface FuelLogResponse extends FuelLogPayload {
  id: number;
  created_by: number;
  created_at: string;
}

export async function fetchFuelLogs(): Promise<FuelLogResponse[]> {
  const { data } = await apiClient.get<FuelLogResponse[]>("/fuel-logs");
  return data;
}

export async function createFuelLog(payload: FuelLogPayload): Promise<FuelLogResponse> {
  const { data } = await apiClient.post<FuelLogResponse>("/fuel-logs", payload);
  return data;
}

// --- EXPENSES ---
export interface ExpensePayload {
  vehicle_id: number;
  category: string;
  amount: number;
  description: string;
  expense_date: string; // YYYY-MM-DD
}

export interface ExpenseResponse extends ExpensePayload {
  id: number;
  created_by: number;
  created_at: string;
}

export async function fetchExpenses(): Promise<ExpenseResponse[]> {
  const { data } = await apiClient.get<ExpenseResponse[]>("/expenses");
  return data;
}

export async function createExpense(payload: ExpensePayload): Promise<ExpenseResponse> {
  const { data } = await apiClient.post<ExpenseResponse>("/expenses", payload);
  return data;
}

// --- DASHBOARD & ANALYTICS ---
export interface DashboardMetrics {
  active_vehicles: number;
  available_vehicles: number;
  maintenance_vehicles: number;
  active_trips: number;
  pending_trips: number;
  drivers_on_duty: number;
  fleet_utilization: number;
}

export interface OperationalCostSummary {
  vehicle_id: number;
  registration_number: string;
  fuel_cost: number;
  maintenance_cost: number;
  total_cost: number;
}

export interface FuelEfficiencySummary {
  vehicle_id: number;
  registration_number: string;
  total_distance: number;
  total_fuel: number;
  efficiency: number;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get<DashboardMetrics>("/dashboard");
  return data;
}

export async function fetchOperationalCosts(): Promise<OperationalCostSummary[]> {
  const { data } = await apiClient.get<OperationalCostSummary[]>("/analytics/operational-cost");
  return data;
}

export async function fetchFuelEfficiency(): Promise<FuelEfficiencySummary[]> {
  const { data } = await apiClient.get<FuelEfficiencySummary[]>("/analytics/fuel-efficiency");
  return data;
}
