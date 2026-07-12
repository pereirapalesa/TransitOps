from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.enums import DriverStatus


class DriverBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    license_number: str = Field(..., min_length=1, max_length=100)
    license_category: str = Field(..., min_length=1, max_length=50)
    license_expiry_date: date
    contact_number: str = Field(..., min_length=1, max_length=20)
    safety_score: float = Field(
        default=100.0, ge=0, le=100, description="Safety score between 0 and 100"
    )
    status: DriverStatus = DriverStatus.Available


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    license_number: Optional[str] = Field(None, min_length=1, max_length=100)
    license_category: Optional[str] = Field(None, min_length=1, max_length=50)
    license_expiry_date: Optional[date] = None
    contact_number: Optional[str] = Field(None, min_length=1, max_length=20)
    safety_score: Optional[float] = Field(None, ge=0, le=100)
    status: Optional[DriverStatus] = None


class DriverResponse(DriverBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
