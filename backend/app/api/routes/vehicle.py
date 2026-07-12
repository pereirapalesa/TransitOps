from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user, RoleChecker
from app.models.user import User
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.enums import Roles
import app.services.vehicle as vehicle_service

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)

@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([Roles.Fleet_Manager]))
):
    try:
        return vehicle_service.create_vehicle(db, data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("", response_model=list[VehicleResponse])
def get_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vehicle_service.get_all_vehicles(db)

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vehicle = vehicle_service.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    return vehicle

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([Roles.Fleet_Manager]))
):
    vehicle = vehicle_service.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    try:
        return vehicle_service.update_vehicle(db, vehicle, data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([Roles.Fleet_Manager]))
):
    success = vehicle_service.delete_vehicle(db, vehicle_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    return {"message": "Vehicle deleted successfully"}

from pydantic import BaseModel

class VehicleCostSummary(BaseModel):
    fuel_cost: float
    maintenance_cost: float
    total_operational_cost: float

class VehicleFuelEfficiency(BaseModel):
    distance: float
    fuel_consumed: float
    efficiency: float

@router.get("/{vehicle_id}/cost-summary", response_model=VehicleCostSummary)
def get_vehicle_cost_summary(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summary = vehicle_service.get_vehicle_cost_summary(db, vehicle_id)
    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    return summary

@router.get("/{vehicle_id}/fuel-efficiency", response_model=VehicleFuelEfficiency)
def get_vehicle_fuel_efficiency(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    efficiency = vehicle_service.get_vehicle_fuel_efficiency(db, vehicle_id)
    if efficiency is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    return efficiency

