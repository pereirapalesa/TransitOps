from datetime import date, datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums import TripStatus, VehicleStatus, DriverStatus
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.schemas.trip import TripCreate, TripUpdate


def get_trip(db: Session, trip_id: int) -> Trip | None:
    return db.query(Trip).filter(Trip.id == trip_id).first()


def list_trips(db: Session) -> list[Trip]:
    return db.query(Trip).all()


def create_trip(db: Session, trip_in: TripCreate, user_id: int) -> Trip:
    # 1. Check vehicle existence and business rules
    vehicle = db.query(Vehicle).filter(Vehicle.id == trip_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    if vehicle.status == VehicleStatus.Retired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle must NOT be Retired",
        )
    if vehicle.status == VehicleStatus.InShop:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle must NOT be In Shop",
        )
    if vehicle.status != VehicleStatus.Available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle status must be Available, currently is {vehicle.status.value}",
        )

    # 2. Check driver existence and business rules
    driver = db.query(Driver).filter(Driver.id == trip_in.driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found",
        )
    if driver.status == DriverStatus.Suspended:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Driver must NOT be Suspended",
        )
    if driver.status != DriverStatus.Available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Driver status must be Available, currently is {driver.status.value}",
        )
    if driver.license_expiry_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Driver license must NOT be expired",
        )

    # 3. Check cargo weight vs vehicle capacity
    if trip_in.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cargo Weight ({trip_in.cargo_weight}) must be less than or equal to Vehicle Maximum Load Capacity ({vehicle.max_load_capacity})",
        )

    # 4. Create Trip
    db_trip = Trip(
        source=trip_in.source,
        destination=trip_in.destination,
        vehicle_id=trip_in.vehicle_id,
        driver_id=trip_in.driver_id,
        cargo_weight=trip_in.cargo_weight,
        planned_distance=trip_in.planned_distance,
        status=TripStatus.Draft,
        starting_odometer=trip_in.starting_odometer,
        created_by=user_id,
    )
    
    try:
        db.add(db_trip)
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create trip: {str(e)}",
        )


def update_trip(db: Session, trip_id: int, trip_in: TripUpdate) -> Trip:
    db_trip = get_trip(db, trip_id)
    if not db_trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    # If trip is not Draft, restrict update
    if db_trip.status != TripStatus.Draft:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only trips in Draft status can be updated",
        )

    update_data = trip_in.model_dump(exclude_unset=True)

    # Validate updated vehicle if changed
    if "vehicle_id" in update_data and update_data["vehicle_id"] != db_trip.vehicle_id:
        v_id = update_data["vehicle_id"]
        vehicle = db.query(Vehicle).filter(Vehicle.id == v_id).first()
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )
        if vehicle.status == VehicleStatus.Retired:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle must NOT be Retired",
            )
        if vehicle.status == VehicleStatus.InShop:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle must NOT be In Shop",
            )
        if vehicle.status != VehicleStatus.Available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Vehicle status must be Available, currently is {vehicle.status.value}",
            )
        # Cargo weight validation for new vehicle
        weight = update_data.get("cargo_weight", db_trip.cargo_weight)
        if weight > vehicle.max_load_capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cargo Weight ({weight}) exceeds new Vehicle Max Load Capacity ({vehicle.max_load_capacity})",
            )

    # Validate updated driver if changed
    if "driver_id" in update_data and update_data["driver_id"] != db_trip.driver_id:
        d_id = update_data["driver_id"]
        driver = db.query(Driver).filter(Driver.id == d_id).first()
        if not driver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found",
            )
        if driver.status == DriverStatus.Suspended:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Driver must NOT be Suspended",
            )
        if driver.status != DriverStatus.Available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Driver status must be Available, currently is {driver.status.value}",
            )
        if driver.license_expiry_date < date.today():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Driver license must NOT be expired",
            )

    # Validate updated cargo weight against current vehicle if vehicle not changed
    if "cargo_weight" in update_data and ("vehicle_id" not in update_data or update_data["vehicle_id"] == db_trip.vehicle_id):
        vehicle = db.query(Vehicle).filter(Vehicle.id == db_trip.vehicle_id).first()
        if vehicle and update_data["cargo_weight"] > vehicle.max_load_capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cargo Weight ({update_data['cargo_weight']}) exceeds Vehicle Max Load Capacity ({vehicle.max_load_capacity})",
            )

    for field, value in update_data.items():
        setattr(db_trip, field, value)

    try:
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update trip: {str(e)}",
        )


def delete_trip(db: Session, trip_id: int) -> bool:
    db_trip = get_trip(db, trip_id)
    if not db_trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )
    
    if db_trip.status == TripStatus.Dispatched:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a dispatched trip. Cancel it first.",
        )

    try:
        db.delete(db_trip)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete trip: {str(e)}",
        )


def dispatch_trip(db: Session, trip_id: int) -> Trip:
    # 1. Find trip
    db_trip = get_trip(db, trip_id)
    if not db_trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    # 2. Check current status
    if db_trip.status != TripStatus.Draft:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trip must be in Draft status to be dispatched, current status is {db_trip.status.value}",
        )

    # 3. Retrieve vehicle & driver
    vehicle = db_trip.vehicle
    driver = db_trip.driver

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle associated with the trip was not found",
        )
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver associated with the trip was not found",
        )

    # 4. Validate they are still Available/Valid
    if vehicle.status == VehicleStatus.Retired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle must NOT be Retired",
        )
    if vehicle.status == VehicleStatus.InShop:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle must NOT be In Shop",
        )
    if vehicle.status != VehicleStatus.Available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle is already On Trip or not Available (current status: {vehicle.status.value})",
        )

    if driver.status == DriverStatus.Suspended:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Driver must NOT be Suspended",
        )
    if driver.status != DriverStatus.Available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Driver is already On Trip or not Available (current status: {driver.status.value})",
        )
    if driver.license_expiry_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Driver license must NOT be expired",
        )

    # 5. Update statuses
    db_trip.status = TripStatus.Dispatched
    db_trip.dispatch_time = datetime.now(timezone.utc)
    
    vehicle.status = VehicleStatus.OnTrip
    driver.status = DriverStatus.OnTrip

    try:
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dispatch trip: {str(e)}",
        )


def complete_trip(db: Session, trip_id: int, ending_odometer: float) -> Trip:
    # 1. Find trip
    db_trip = get_trip(db, trip_id)
    if not db_trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    # 2. Check current status
    if db_trip.status != TripStatus.Dispatched:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trip must be in Dispatched status to be completed, current status is {db_trip.status.value}",
        )

    # 3. Validate ending odometer
    if ending_odometer < db_trip.starting_odometer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ending odometer ({ending_odometer}) cannot be less than starting odometer ({db_trip.starting_odometer})",
        )

    # 4. Retrieve vehicle & driver
    vehicle = db_trip.vehicle
    driver = db_trip.driver

    # 5. Update statuses
    db_trip.status = TripStatus.Completed
    db_trip.completion_time = datetime.now(timezone.utc)
    db_trip.ending_odometer = ending_odometer

    if vehicle:
        vehicle.status = VehicleStatus.Available
        vehicle.odometer = ending_odometer  # Keep odometer updated on vehicle

    if driver:
        driver.status = DriverStatus.Available

    try:
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete trip: {str(e)}",
        )


def cancel_trip(db: Session, trip_id: int) -> Trip:
    # 1. Find trip
    db_trip = get_trip(db, trip_id)
    if not db_trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    # 2. Check current status
    if db_trip.status in (TripStatus.Completed, TripStatus.Cancelled):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel a trip that is already {db_trip.status.value}",
        )

    # 3. Retrieve vehicle & driver if Dispatched
    if db_trip.status == TripStatus.Dispatched:
        vehicle = db_trip.vehicle
        driver = db_trip.driver

        if vehicle:
            vehicle.status = VehicleStatus.Available
        if driver:
            driver.status = DriverStatus.Available

    # 4. Set status to Cancelled
    db_trip.status = TripStatus.Cancelled

    try:
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cancel trip: {str(e)}",
        )
