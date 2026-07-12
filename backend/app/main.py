from fastapi import FastAPI
from app.db import db_ping
from app.api.routes.auth import router as auth_router
from app.api.routes.vehicle import router as vehicle_router
from app.api.routes.drivers import router as driver_router
from app.api.routes.trips import router as trip_router
from app.api.routes.maintenance import router as maint_router
from app.api.routes.fuel_logs import router as fuel_router
from app.api.routes.expenses import router as expense_router
from app.api.routes.dashboard import router as dashboard_router

app = FastAPI(title="TransitOps API")

app.include_router(auth_router)
app.include_router(vehicle_router)
app.include_router(driver_router)
app.include_router(trip_router)
app.include_router(maint_router)
app.include_router(fuel_router)
app.include_router(expense_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok", "database": db_ping()}