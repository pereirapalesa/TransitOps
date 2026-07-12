from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse
import app.services.expense_service as expense_service

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)

@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return expense_service.create_expense(db, data, current_user.id)

@router.get("", response_model=list[ExpenseResponse])
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return expense_service.get_expenses(db)

@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exp = expense_service.get_expense(db, expense_id)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    return exp

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense_service.delete_expense(db, expense_id)
    return {"message": "Expense deleted successfully"}
