from pydantic import BaseModel

class DashboardMetricsResponse(BaseModel):
    active_vehicles: int
    available_vehicles: int
    maintenance_vehicles: int
    active_trips: int
    pending_trips: int
    drivers_on_duty: int
    fleet_utilization: float

class OperationalCostResponse(BaseModel):
    vehicle_id: int
    registration_number: str
    fuel_cost: float
    maintenance_cost: float
    total_cost: float

class FuelEfficiencyResponse(BaseModel):
    vehicle_id: int
    registration_number: str
    total_distance: float
    total_fuel: float
    efficiency: float

class ROIUnavailableResponse(BaseModel):
    message: str
