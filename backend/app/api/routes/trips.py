from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.trip import (
    TripCreate,
    TripResponse,
    TripUpdate,
    TripComplete,
)
import app.services.trip_service as trip_service

router = APIRouter(
    prefix="/trips",
    tags=["Trips"],
)


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(
    data: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new trip in Draft status.
    """
    return trip_service.create_trip(db, data, current_user.id)


@router.get("", response_model=list[TripResponse])
def get_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all trips.
    """
    return trip_service.list_trips(db)


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get details of a specific trip by ID.
    """
    trip = trip_service.get_trip(db, trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )
    return trip


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    data: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an existing trip (only allowed in Draft status).
    """
    return trip_service.update_trip(db, trip_id, data)


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a trip.
    """
    trip_service.delete_trip(db, trip_id)
    return {"message": "Trip deleted successfully"}


@router.post("/{trip_id}/dispatch", response_model=TripResponse)
def dispatch_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Dispatch a trip in Draft status. Updates vehicle and driver status to On Trip.
    """
    return trip_service.dispatch_trip(db, trip_id)


@router.post("/{trip_id}/complete", response_model=TripResponse)
def complete_trip(
    trip_id: int,
    data: TripComplete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Complete a dispatched trip. Updates vehicle and driver status back to Available.
    """
    return trip_service.complete_trip(db, trip_id, data.ending_odometer)


@router.post("/{trip_id}/cancel", response_model=TripResponse)
def cancel_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Cancel a trip (if dispatched, restores vehicle and driver statuses to Available).
    """
    return trip_service.cancel_trip(db, trip_id)
