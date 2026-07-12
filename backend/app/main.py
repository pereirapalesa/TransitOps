from fastapi import FastAPI
from app.db import db_ping

app = FastAPI(title="TransitOps API")


@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok", "database": db_ping()}