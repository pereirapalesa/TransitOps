from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user, RoleChecker
from app.models.user import User
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse
from app.enums import Roles
import app.services.driver as driver_service

router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"],
)


@router.get("/available", response_model=list[DriverResponse])
def get_available_drivers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return driver_service.get_available_drivers(db)


@router.post("", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
def create_driver(
    data: DriverCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([Roles.Fleet_Manager])),
):
    try:
        return driver_service.create_driver(db, data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("", response_model=list[DriverResponse])
def get_drivers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return driver_service.get_all_drivers(db)


@router.get("/{driver_id}", response_model=DriverResponse)
def get_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    driver = driver_service.get_driver_by_id(db, driver_id)
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found",
        )
    return driver


@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: int,
    data: DriverUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([Roles.Fleet_Manager])),
):
    driver = driver_service.get_driver_by_id(db, driver_id)
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found",
        )
    try:
        return driver_service.update_driver(db, driver, data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/{driver_id}")
def delete_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([Roles.Fleet_Manager])),
):
    success = driver_service.delete_driver(db, driver_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found",
        )
    return {"message": "Driver deleted successfully"}
