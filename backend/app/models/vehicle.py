from datetime import datetime
from sqlalchemy import String, Float, DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.enums import VehicleStatus

class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(primary_key=True)
    registration_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )
    model: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    max_load_capacity: Mapped[float] = mapped_column(Float, nullable=False)
    odometer: Mapped[float] = mapped_column(Float, nullable=False)
    acquisition_cost: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[VehicleStatus] = mapped_column(
        Enum(VehicleStatus, name="vehicle_status"),
        nullable=False,
        default=VehicleStatus.Available,
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

    maintenance_logs = relationship("MaintenanceLog", back_populates="vehicle", cascade="all, delete-orphan")
    fuel_logs = relationship("FuelLog", back_populates="vehicle", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="vehicle", cascade="all, delete-orphan")
