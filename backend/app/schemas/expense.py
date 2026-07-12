from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.enums import ExpenseCategory

class ExpenseBase(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    category: ExpenseCategory
    description: Optional[str] = Field(None, max_length=1000)
    amount: float = Field(..., gt=0.0, description="Amount must be greater than 0")
    expense_date: date = Field(default_factory=date.today)

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    category: Optional[ExpenseCategory] = None
    description: Optional[str] = Field(None, max_length=1000)
    amount: Optional[float] = Field(None, gt=0.0)
    expense_date: Optional[date] = None

class ExpenseResponse(ExpenseBase):
    id: int
    created_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
