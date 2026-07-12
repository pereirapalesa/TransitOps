from datetime import date, datetime
from sqlalchemy import String, Float, DateTime, Enum, ForeignKey, Date, CheckConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.enums import MaintenanceStatus

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    __table_args__ = (
        CheckConstraint("cost >= 0", name="check_cost_non_negative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    maintenance_type: Mapped[str] = mapped_column(String(100), nullable=False)
    cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    start_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    
    status: Mapped[MaintenanceStatus] = mapped_column(
        Enum(MaintenanceStatus, name="maintenance_status"),
        nullable=False,
        default=MaintenanceStatus.OPEN,
    )
    
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
    vehicle = relationship("Vehicle", back_populates="maintenance_logs")
    creator = relationship("User")
