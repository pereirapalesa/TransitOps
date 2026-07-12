from datetime import date, datetime
from sqlalchemy import String, Float, DateTime, Enum, ForeignKey, Date, CheckConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.enums import ExpenseCategory

class Expense(Base):
    __tablename__ = "expenses"
    __table_args__ = (
        CheckConstraint("amount > 0", name="check_expense_amount_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False, index=True)
    category: Mapped[ExpenseCategory] = mapped_column(
        Enum(ExpenseCategory, name="expense_category"),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    expense_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    vehicle = relationship("Vehicle", back_populates="expenses")
    creator = relationship("User")
