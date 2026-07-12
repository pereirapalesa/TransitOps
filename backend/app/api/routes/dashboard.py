from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.dashboard import (
    DashboardMetricsResponse,
    OperationalCostResponse,
    FuelEfficiencyResponse,
    ROIUnavailableResponse
)
import app.services.dashboard_service as dashboard_service

router = APIRouter(
    tags=["Dashboard & Analytics"]
)

@router.get("/dashboard", response_model=DashboardMetricsResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return dashboard_service.get_dashboard_metrics(db)

@router.get("/analytics/operational-cost", response_model=list[OperationalCostResponse])
def get_operational_cost(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return dashboard_service.get_vehicle_cost_summary(db)

@router.get("/analytics/fuel-efficiency", response_model=list[FuelEfficiencyResponse])
def get_fuel_efficiency(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return dashboard_service.get_fuel_efficiency(db)

@router.get("/analytics/roi", response_model=ROIUnavailableResponse)
def get_roi(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {"message": "Revenue data unavailable"}

@router.get("/analytics/vehicle-roi", response_model=ROIUnavailableResponse)
def get_vehicle_roi(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {"message": "Revenue data unavailable"}

@router.get("/reports/export/vehicles")
def export_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    generator = dashboard_service.generate_vehicles_csv(db)
    return StreamingResponse(
        generator,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=vehicles_report.csv"}
    )
