from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.vehicle import Vehicle
from app.schemas.expense import ExpenseCreate


def get_expense(db: Session, expense_id: int) -> Expense | None:
    return db.query(Expense).filter(Expense.id == expense_id).first()


def get_expenses(db: Session) -> list[Expense]:
    return db.query(Expense).all()


def get_vehicle_expenses(db: Session, vehicle_id: int) -> list[Expense]:
    return db.query(Expense).filter(Expense.vehicle_id == vehicle_id).all()


def create_expense(db: Session, exp_in: ExpenseCreate, user_id: int) -> Expense:
    # 1. Ensure vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == exp_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    # 2. Create Expense
    db_exp = Expense(
        vehicle_id=exp_in.vehicle_id,
        category=exp_in.category,
        description=exp_in.description,
        amount=exp_in.amount,
        expense_date=exp_in.expense_date,
        created_by=user_id,
    )

    try:
        db.add(db_exp)
        db.commit()
        db.refresh(db_exp)
        return db_exp
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create expense: {str(e)}",
        )


def delete_expense(db: Session, expense_id: int) -> bool:
    db_exp = get_expense(db, expense_id)
    if not db_exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )

    try:
        db.delete(db_exp)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete expense: {str(e)}",
        )
