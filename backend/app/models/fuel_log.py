from datetime import date, datetime
from sqlalchemy import Float, DateTime, ForeignKey, Date, CheckConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class FuelLog(Base):
    __tablename__ = "fuel_logs"
    __table_args__ = (
        CheckConstraint("liters > 0", name="check_fuel_liters_positive"),
        CheckConstraint("cost > 0", name="check_fuel_cost_positive"),
        CheckConstraint("odometer_reading >= 0", name="check_fuel_odometer_non_negative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)
    liters: Mapped[float] = mapped_column(Float, nullable=False)
    cost: Mapped[float] = mapped_column(Float, nullable=False)
    fuel_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    odometer_reading: Mapped[float] = mapped_column(Float, nullable=False)
    
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    vehicle = relationship("Vehicle", back_populates="fuel_logs")
    creator = relationship("User")
