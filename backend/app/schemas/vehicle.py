from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.enums import VehicleStatus

class VehicleBase(BaseModel):
    registration_number: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=255)
    type: str = Field(..., min_length=1, max_length=100)
    max_load_capacity: float = Field(..., gt=0, description="Max load capacity in kg/tons")
    odometer: float = Field(..., ge=0, description="Odometer reading in km")
    acquisition_cost: float = Field(..., ge=0, description="Acquisition cost")
    status: VehicleStatus = VehicleStatus.Available

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    registration_number: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[str] = Field(None, min_length=1, max_length=100)
    max_load_capacity: Optional[float] = Field(None, gt=0)
    odometer: Optional[float] = Field(None, ge=0)
    acquisition_cost: Optional[float] = Field(None, ge=0)
    status: Optional[VehicleStatus] = None

class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
