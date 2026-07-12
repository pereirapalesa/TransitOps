from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class FuelLogBase(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    liters: float = Field(..., gt=0.0, description="Liters must be greater than 0")
    cost: float = Field(..., gt=0.0, description="Cost must be greater than 0")
    fuel_date: date = Field(default_factory=date.today)
    odometer_reading: float = Field(..., ge=0.0, description="Odometer reading must be non-negative")

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogUpdate(BaseModel):
    liters: Optional[float] = Field(None, gt=0.0)
    cost: Optional[float] = Field(None, gt=0.0)
    fuel_date: Optional[date] = None
    odometer_reading: Optional[float] = Field(None, ge=0.0)

class FuelLogResponse(FuelLogBase):
    id: int
    created_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
