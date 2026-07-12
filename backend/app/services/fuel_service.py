from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.fuel_log import FuelLog
from app.models.vehicle import Vehicle
from app.schemas.fuel_log import FuelLogCreate


def get_fuel_log(db: Session, fuel_log_id: int) -> FuelLog | None:
    return db.query(FuelLog).filter(FuelLog.id == fuel_log_id).first()


def get_fuel_logs(db: Session) -> list[FuelLog]:
    return db.query(FuelLog).all()


def get_vehicle_fuel_history(db: Session, vehicle_id: int) -> list[FuelLog]:
    return (
        db.query(FuelLog)
        .filter(FuelLog.vehicle_id == vehicle_id)
        .order_by(desc(FuelLog.odometer_reading))
        .all()
    )


def create_fuel_log(db: Session, fuel_in: FuelLogCreate, user_id: int) -> FuelLog:
    # 1. Ensure vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == fuel_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    # 2. Ensure odometer reading is valid if previous odometer tracking exists
    latest_fuel_log = (
        db.query(FuelLog)
        .filter(FuelLog.vehicle_id == fuel_in.vehicle_id)
        .order_by(desc(FuelLog.odometer_reading))
        .first()
    )
    if latest_fuel_log and fuel_in.odometer_reading < latest_fuel_log.odometer_reading:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Odometer reading ({fuel_in.odometer_reading}) cannot be less than the previous fuel log odometer reading ({latest_fuel_log.odometer_reading})",
        )

    # 3. Create FuelLog
    db_fuel = FuelLog(
        vehicle_id=fuel_in.vehicle_id,
        liters=fuel_in.liters,
        cost=fuel_in.cost,
        fuel_date=fuel_in.fuel_date,
        odometer_reading=fuel_in.odometer_reading,
        created_by=user_id,
    )
    
    # Update vehicle odometer if reading is higher
    if fuel_in.odometer_reading > vehicle.odometer:
        vehicle.odometer = fuel_in.odometer_reading

    try:
        db.add(db_fuel)
        db.commit()
        db.refresh(db_fuel)
        return db_fuel
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create fuel log: {str(e)}",
        )


def delete_fuel_log(db: Session, fuel_log_id: int) -> bool:
    db_fuel = get_fuel_log(db, fuel_log_id)
    if not db_fuel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fuel log not found",
        )

    try:
        db.delete(db_fuel)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete fuel log: {str(e)}",
        )
