from datetime import date, datetime

from sqlalchemy import Date, Float, String, DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.enums import DriverStatus


class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    license_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )
    license_category: Mapped[str] = mapped_column(String(50), nullable=False)
    license_expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    contact_number: Mapped[str] = mapped_column(String(20), nullable=False)
    safety_score: Mapped[float] = mapped_column(
        Float, nullable=False, default=100.0
    )
    status: Mapped[DriverStatus] = mapped_column(
        Enum(DriverStatus, name="driver_status"),
        nullable=False,
        default=DriverStatus.Available,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
