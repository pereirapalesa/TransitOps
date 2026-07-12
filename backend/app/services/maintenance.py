from datetime import date, datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums import MaintenanceStatus, VehicleStatus
from app.models.maintenance import MaintenanceLog
from app.models.vehicle import Vehicle
from app.schemas.maintenance import MaintenanceCreate


def get_maintenance(db: Session, maintenance_id: int) -> MaintenanceLog | None:
    return db.query(MaintenanceLog).filter(MaintenanceLog.id == maintenance_id).first()


def get_all_maintenance(db: Session) -> list[MaintenanceLog]:
    return db.query(MaintenanceLog).all()


def create_maintenance(db: Session, maint_in: MaintenanceCreate, user_id: int) -> MaintenanceLog:
    # 1. Validate vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == maint_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    # 2. Vehicle cannot be Retired
    if vehicle.status == VehicleStatus.Retired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle must NOT be Retired",
        )

    # 3. Prevent multiple active maintenance records for the same vehicle
    active_maint = (
        db.query(MaintenanceLog)
        .filter(
            MaintenanceLog.vehicle_id == maint_in.vehicle_id,
            MaintenanceLog.status == MaintenanceStatus.OPEN,
        )
        .first()
    )
    if active_maint:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle already has an active maintenance record",
        )

    # 4. Create maintenance record
    db_maint = MaintenanceLog(
        vehicle_id=maint_in.vehicle_id,
        title=maint_in.title,
        description=maint_in.description,
        maintenance_type=maint_in.maintenance_type,
        cost=maint_in.cost,
        start_date=maint_in.start_date,
        end_date=maint_in.end_date,
        status=MaintenanceStatus.OPEN,
        created_by=user_id,
    )

    # 5. Automatically update vehicle status to IN_SHOP (InShop in enum)
    vehicle.status = VehicleStatus.InShop

    try:
        db.add(db_maint)
        db.commit()
        db.refresh(db_maint)
        return db_maint
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create maintenance log: {str(e)}",
        )


def complete_maintenance(db: Session, maintenance_id: int) -> MaintenanceLog:
    # 1. Validate maintenance exists
    db_maint = get_maintenance(db, maintenance_id)
    if not db_maint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maintenance log not found",
        )

    if db_maint.status == MaintenanceStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maintenance log is already completed",
        )

    # 2. Update maintenance status to COMPLETED
    db_maint.status = MaintenanceStatus.COMPLETED
    if not db_maint.end_date:
        db_maint.end_date = date.today()

    # 3. If vehicle status is not RETIRED, change it back to AVAILABLE
    vehicle = db_maint.vehicle
    if vehicle and vehicle.status != VehicleStatus.Retired:
        vehicle.status = VehicleStatus.Available

    # 4. Commit changes safely
    try:
        db.commit()
        db.refresh(db_maint)
        return db_maint
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete maintenance: {str(e)}",
        )
