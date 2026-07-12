from datetime import date

from sqlalchemy.orm import Session

from app.enums import DriverStatus
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate


def get_driver_by_id(db: Session, driver_id: int) -> Driver | None:
    return db.query(Driver).filter(Driver.id == driver_id).first()


def get_driver_by_license(db: Session, license_number: str) -> Driver | None:
    return (
        db.query(Driver)
        .filter(Driver.license_number == license_number)
        .first()
    )


def get_all_drivers(db: Session) -> list[Driver]:
    return db.query(Driver).all()


def get_available_drivers(db: Session) -> list[Driver]:
    today = date.today()
    return (
        db.query(Driver)
        .filter(
            Driver.status == DriverStatus.Available,
            Driver.license_expiry_date >= today,
        )
        .all()
    )


def create_driver(db: Session, driver_in: DriverCreate) -> Driver:
    existing = get_driver_by_license(db, driver_in.license_number)
    if existing:
        raise ValueError("Driver with this license number already exists")

    db_driver = Driver(
        name=driver_in.name,
        license_number=driver_in.license_number,
        license_category=driver_in.license_category,
        license_expiry_date=driver_in.license_expiry_date,
        contact_number=driver_in.contact_number,
        safety_score=driver_in.safety_score,
        status=driver_in.status,
    )
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver


def update_driver(
    db: Session, db_driver: Driver, driver_in: DriverUpdate
) -> Driver:
    if (
        driver_in.license_number is not None
        and driver_in.license_number != db_driver.license_number
    ):
        existing = get_driver_by_license(db, driver_in.license_number)
        if existing and existing.id != db_driver.id:
            raise ValueError("Driver with this license number already exists")

    update_data = driver_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_driver, field, value)

    db.commit()
    db.refresh(db_driver)
    return db_driver


def delete_driver(db: Session, driver_id: int) -> bool:
    db_driver = get_driver_by_id(db, driver_id)
    if not db_driver:
        return False
    db.delete(db_driver)
    db.commit()
    return True
