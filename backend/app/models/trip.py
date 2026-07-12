from datetime import datetime
from sqlalchemy import String, Float, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.enums import TripStatus

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(primary_key=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)
    driver_id: Mapped[int] = mapped_column(ForeignKey("drivers.id"), nullable=False, index=True)
    
    cargo_weight: Mapped[float] = mapped_column(Float, nullable=False)
    planned_distance: Mapped[float] = mapped_column(Float, nullable=False)
    
    status: Mapped[TripStatus] = mapped_column(
        Enum(TripStatus, name="trip_status"),
        nullable=False,
        default=TripStatus.Draft,
    )
    
    dispatch_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completion_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    starting_odometer: Mapped[float] = mapped_column(Float, nullable=False)
    ending_odometer: Mapped[float | None] = mapped_column(Float, nullable=True)
    
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    
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

    # Relationships
    vehicle = relationship("Vehicle")
    driver = relationship("Driver")
    creator = relationship("User")
