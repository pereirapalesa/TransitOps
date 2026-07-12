from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate

def get_vehicle_by_id(db: Session, vehicle_id: int) -> Vehicle | None:
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

def get_vehicle_by_registration(db: Session, reg_num: str) -> Vehicle | None:
    return db.query(Vehicle).filter(Vehicle.registration_number == reg_num).first()

def get_all_vehicles(db: Session) -> list[Vehicle]:
    return db.query(Vehicle).all()

def create_vehicle(db: Session, vehicle_in: VehicleCreate) -> Vehicle:
    existing = get_vehicle_by_registration(db, vehicle_in.registration_number)
    if existing:
        raise ValueError("Vehicle with this registration number already exists")
    
    db_vehicle = Vehicle(
        registration_number=vehicle_in.registration_number,
        model=vehicle_in.model,
        type=vehicle_in.type,
        max_load_capacity=vehicle_in.max_load_capacity,
        odometer=vehicle_in.odometer,
        acquisition_cost=vehicle_in.acquisition_cost,
        status=vehicle_in.status,
    )
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def update_vehicle(db: Session, db_vehicle: Vehicle, vehicle_in: VehicleUpdate) -> Vehicle:
    if vehicle_in.registration_number is not None and vehicle_in.registration_number != db_vehicle.registration_number:
        existing = get_vehicle_by_registration(db, vehicle_in.registration_number)
        if existing and existing.id != db_vehicle.id:
            raise ValueError("Vehicle with this registration number already exists")
            
    # Update fields
    update_data = vehicle_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_vehicle, field, value)
        
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def delete_vehicle(db: Session, vehicle_id: int) -> bool:
    db_vehicle = get_vehicle_by_id(db, vehicle_id)
    if not db_vehicle:
        return False
    db.delete(db_vehicle)
    db.commit()
    return True
