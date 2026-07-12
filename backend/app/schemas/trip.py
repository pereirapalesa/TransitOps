from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.enums import TripStatus

class TripBase(BaseModel):
    source: str = Field(..., min_length=1, max_length=255)
    destination: str = Field(..., min_length=1, max_length=255)
    vehicle_id: int = Field(..., gt=0)
    driver_id: int = Field(..., gt=0)
    cargo_weight: float = Field(..., gt=0, description="Cargo weight must be greater than 0")
    planned_distance: float = Field(..., gt=0, description="Planned distance must be greater than 0")
    starting_odometer: float = Field(..., ge=0, description="Starting odometer must be non-negative")

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    source: Optional[str] = Field(None, min_length=1, max_length=255)
    destination: Optional[str] = Field(None, min_length=1, max_length=255)
    vehicle_id: Optional[int] = Field(None, gt=0)
    driver_id: Optional[int] = Field(None, gt=0)
    cargo_weight: Optional[float] = Field(None, gt=0)
    planned_distance: Optional[float] = Field(None, gt=0)
    starting_odometer: Optional[float] = Field(None, ge=0)
    status: Optional[TripStatus] = None

class TripDispatch(BaseModel):
    pass

class TripComplete(BaseModel):
    ending_odometer: float = Field(..., ge=0, description="Ending odometer must be non-negative")

class TripResponse(TripBase):
    id: int
    status: TripStatus
    dispatch_time: Optional[datetime] = None
    completion_time: Optional[datetime] = None
    ending_odometer: Optional[float] = None
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
