from fastapi import FastAPI
from app.db import db_ping
from app.api.routes.auth import router as auth_router
from app.api.routes.vehicle import router as vehicle_router

app = FastAPI(title="TransitOps API")

app.include_router(auth_router)
app.include_router(vehicle_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok", "database": db_ping()}