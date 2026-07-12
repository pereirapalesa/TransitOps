import io
import csv
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.driver import Driver
from app.models.fuel_log import FuelLog
from app.models.maintenance import MaintenanceLog
from app.enums import VehicleStatus, TripStatus, DriverStatus


def get_fleet_utilization(db: Session) -> float:
    active_vehicles = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.OnTrip).count()
    total_non_retired = db.query(Vehicle).filter(Vehicle.status != VehicleStatus.Retired).count()
    if total_non_retired == 0:
        return 0.0
    return round((active_vehicles / total_non_retired) * 100.0, 2)


def get_dashboard_metrics(db: Session) -> dict:
    active_vehicles = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.OnTrip).count()
    available_vehicles = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.Available).count()
    maintenance_vehicles = db.query(Vehicle).filter(Vehicle.status == VehicleStatus.InShop).count()
    active_trips = db.query(Trip).filter(Trip.status == TripStatus.Dispatched).count()
    pending_trips = db.query(Trip).filter(Trip.status == TripStatus.Draft).count()
    drivers_on_duty = db.query(Driver).filter(Driver.status == DriverStatus.OnTrip).count()
    
    fleet_utilization = get_fleet_utilization(db)
    
    return {
        "active_vehicles": active_vehicles,
        "available_vehicles": available_vehicles,
        "maintenance_vehicles": maintenance_vehicles,
        "active_trips": active_trips,
        "pending_trips": pending_trips,
        "drivers_on_duty": drivers_on_duty,
        "fleet_utilization": fleet_utilization
    }


def get_vehicle_cost_summary(db: Session) -> list[dict]:
    fuel_sub = db.query(
        FuelLog.vehicle_id,
        func.coalesce(func.sum(FuelLog.cost), 0.0).label("fuel_cost")
    ).group_by(FuelLog.vehicle_id).subquery()
    
    maint_sub = db.query(
        MaintenanceLog.vehicle_id,
        func.coalesce(func.sum(MaintenanceLog.cost), 0.0).label("maintenance_cost")
    ).group_by(MaintenanceLog.vehicle_id).subquery()
    
    query = db.query(
        Vehicle.id.label("vehicle_id"),
        Vehicle.registration_number,
        func.coalesce(fuel_sub.c.fuel_cost, 0.0).label("fuel_cost"),
        func.coalesce(maint_sub.c.maintenance_cost, 0.0).label("maintenance_cost")
    ).outerjoin(
        fuel_sub, Vehicle.id == fuel_sub.c.vehicle_id
    ).outerjoin(
        maint_sub, Vehicle.id == maint_sub.c.vehicle_id
    )
    
    results = []
    for row in query.all():
        fuel_cost = float(row.fuel_cost)
        maint_cost = float(row.maintenance_cost)
        results.append({
            "vehicle_id": row.vehicle_id,
            "registration_number": row.registration_number,
            "fuel_cost": fuel_cost,
            "maintenance_cost": maint_cost,
            "total_cost": round(fuel_cost + maint_cost, 2)
        })
    return results


def get_fuel_efficiency(db: Session) -> list[dict]:
    fuel_liters_sub = db.query(
        FuelLog.vehicle_id,
        func.coalesce(func.sum(FuelLog.liters), 0.0).label("total_fuel")
    ).group_by(FuelLog.vehicle_id).subquery()
    
    trip_sub = db.query(
        Trip.vehicle_id,
        func.coalesce(func.sum(Trip.planned_distance), 0.0).label("total_distance")
    ).filter(Trip.status == TripStatus.Completed).group_by(Trip.vehicle_id).subquery()
    
    query = db.query(
        Vehicle.id.label("vehicle_id"),
        Vehicle.registration_number,
        func.coalesce(trip_sub.c.total_distance, 0.0).label("total_distance"),
        func.coalesce(fuel_liters_sub.c.total_fuel, 0.0).label("total_fuel")
    ).outerjoin(
        trip_sub, Vehicle.id == trip_sub.c.vehicle_id
    ).outerjoin(
        fuel_liters_sub, Vehicle.id == fuel_liters_sub.c.vehicle_id
    )
    
    results = []
    for row in query.all():
        total_distance = float(row.total_distance)
        total_fuel = float(row.total_fuel)
        efficiency = 0.0
        if total_fuel > 0.0:
            efficiency = total_distance / total_fuel
        results.append({
            "vehicle_id": row.vehicle_id,
            "registration_number": row.registration_number,
            "total_distance": total_distance,
            "total_fuel": total_fuel,
            "efficiency": round(efficiency, 2)
        })
    return results


def generate_vehicles_csv(db: Session):
    vehicles = db.query(Vehicle).order_by(Vehicle.id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "registration_number",
        "model",
        "type",
        "status",
        "odometer",
        "acquisition_cost"
    ])
    yield output.getvalue()
    output.seek(0)
    output.truncate(0)
    
    for v in vehicles:
        writer.writerow([
            v.registration_number,
            v.model,
            v.type,
            v.status.value if hasattr(v.status, "value") else str(v.status),
            v.odometer,
            v.acquisition_cost
        ])
        yield output.getvalue()
        output.seek(0)
        output.truncate(0)
