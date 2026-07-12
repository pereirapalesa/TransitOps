from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse
import app.services.maintenance as maint_service

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"],
)

@router.post("", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance(
    data: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new maintenance record for a vehicle. Updates vehicle status to In Shop.
    """
    return maint_service.create_maintenance(db, data, current_user.id)

@router.get("", response_model=list[MaintenanceResponse])
def get_all_maintenance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all maintenance records.
    """
    return maint_service.get_all_maintenance(db)

@router.get("/{maintenance_id}", response_model=MaintenanceResponse)
def get_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get a specific maintenance log by ID.
    """
    maint = maint_service.get_maintenance(db, maintenance_id)
    if not maint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maintenance log not found",
        )
    return maint

@router.post("/{maintenance_id}/complete", response_model=MaintenanceResponse)
def complete_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Complete an open maintenance log. Updates vehicle status back to Available.
    """
    return maint_service.complete_maintenance(db, maintenance_id)
