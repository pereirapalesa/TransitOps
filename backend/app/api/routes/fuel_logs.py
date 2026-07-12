from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.fuel_log import FuelLogCreate, FuelLogResponse
import app.services.fuel_service as fuel_service

router = APIRouter(
    prefix="/fuel-logs",
    tags=["Fuel Logs"],
)

@router.post("", response_model=FuelLogResponse, status_code=status.HTTP_201_CREATED)
def create_fuel_log(
    data: FuelLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return fuel_service.create_fuel_log(db, data, current_user.id)

@router.get("", response_model=list[FuelLogResponse])
def get_fuel_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return fuel_service.get_fuel_logs(db)

@router.get("/{fuel_log_id}", response_model=FuelLogResponse)
def get_fuel_log(
    fuel_log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = fuel_service.get_fuel_log(db, fuel_log_id)
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fuel log not found",
        )
    return log

@router.delete("/{fuel_log_id}")
def delete_fuel_log(
    fuel_log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    fuel_service.delete_fuel_log(db, fuel_log_id)
    return {"message": "Fuel log deleted successfully"}
