from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.enums import MaintenanceStatus

class MaintenanceBase(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    maintenance_type: str = Field(..., min_length=1, max_length=100)
    cost: float = Field(default=0.0, ge=0.0, description="Cost must be non-negative")
    start_date: date = Field(default_factory=date.today)
    end_date: Optional[date] = None

class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    maintenance_type: Optional[str] = Field(None, min_length=1, max_length=100)
    cost: Optional[float] = Field(None, ge=0.0)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[MaintenanceStatus] = None

class MaintenanceResponse(MaintenanceBase):
    id: int
    status: MaintenanceStatus
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
