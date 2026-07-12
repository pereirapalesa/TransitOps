import pytest
import csv
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
import app.models  # ensure models are registered
from app.deps import get_db, get_current_user
from app.main import app
from fastapi.testclient import TestClient

from sqlalchemy.pool import StaticPool

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(name="db_session")
def db_session_fixture():
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    SessionTesting = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionTesting()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(name="client")
def client_fixture(db_session):
    # Override get_db to return our testing session
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    # Override get_current_user to return a test user
    def override_get_current_user():
        from app.models.user import User
        from app.models.role import Role
        from app.enums import Roles
        
        role = db_session.query(Role).filter(Role.name == Roles.Fleet_Manager).first()
        if not role:
            role = Role(name=Roles.Fleet_Manager)
            db_session.add(role)
            db_session.commit()
            db_session.refresh(role)
            
        user = db_session.query(User).filter(User.email == "test@transitops.com").first()
        if not user:
            user = User(email="test@transitops.com", password_hash="dummy", role_id=role.id)
            db_session.add(user)
            db_session.commit()
            db_session.refresh(user)
        return user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    with TestClient(app) as c:
        yield c
        
    app.dependency_overrides.clear()


def test_dashboard_metrics_empty(client, db_session):
    response = client.get("/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["active_vehicles"] == 0
    assert data["available_vehicles"] == 0
    assert data["maintenance_vehicles"] == 0
    assert data["active_trips"] == 0
    assert data["pending_trips"] == 0
    assert data["drivers_on_duty"] == 0
    assert data["fleet_utilization"] == 0.0


def test_dashboard_metrics_with_data(client, db_session):
    from app.models.user import User
    from app.models.role import Role
    from app.models.vehicle import Vehicle
    from app.models.driver import Driver
    from app.models.trip import Trip
    from app.enums import Roles, VehicleStatus, DriverStatus, TripStatus
    
    role = Role(name=Roles.Fleet_Manager)
    db_session.add(role)
    db_session.commit()
    
    user = User(email="test2@transitops.com", password_hash="dummy", role_id=role.id)
    db_session.add(user)
    db_session.commit()
    
    # 4 vehicles: 1 OnTrip, 1 Available, 1 InShop, 1 Retired
    v1 = Vehicle(registration_number="V1", model="M1", type="T1", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0, status=VehicleStatus.OnTrip)
    v2 = Vehicle(registration_number="V2", model="M2", type="T2", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0, status=VehicleStatus.Available)
    v3 = Vehicle(registration_number="V3", model="M3", type="T3", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0, status=VehicleStatus.InShop)
    v4 = Vehicle(registration_number="V4", model="M4", type="T4", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0, status=VehicleStatus.Retired)
    db_session.add_all([v1, v2, v3, v4])
    
    # 2 drivers: 1 OnTrip, 1 Available
    d1 = Driver(name="D1", license_number="L1", license_category="C1", license_expiry_date=datetime.date(2027, 12, 31), contact_number="123", status=DriverStatus.OnTrip)
    d2 = Driver(name="D2", license_number="L2", license_category="C2", license_expiry_date=datetime.date(2027, 12, 31), contact_number="456", status=DriverStatus.Available)
    db_session.add_all([d1, d2])
    db_session.commit()
    
    # Trips: 1 Dispatched, 1 Draft
    t1 = Trip(source="S1", destination="D1", vehicle_id=v1.id, driver_id=d1.id, cargo_weight=5.0, planned_distance=50.0, starting_odometer=100.0, status=TripStatus.Dispatched, created_by=user.id)
    t2 = Trip(source="S2", destination="D2", vehicle_id=v2.id, driver_id=d2.id, cargo_weight=5.0, planned_distance=50.0, starting_odometer=100.0, status=TripStatus.Draft, created_by=user.id)
    db_session.add_all([t1, t2])
    db_session.commit()
    
    response = client.get("/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["active_vehicles"] == 1
    assert data["available_vehicles"] == 1
    assert data["maintenance_vehicles"] == 1
    assert data["active_trips"] == 1
    assert data["pending_trips"] == 1
    assert data["drivers_on_duty"] == 1
    # Utilization: (active_vehicles / non-retired) * 100 = (1 / 3) * 100 = 33.33
    assert data["fleet_utilization"] == 33.33


def test_operational_cost_analytics(client, db_session):
    from app.models.user import User
    from app.models.role import Role
    from app.models.vehicle import Vehicle
    from app.models.fuel_log import FuelLog
    from app.models.maintenance import MaintenanceLog
    from app.enums import Roles
    
    role = Role(name=Roles.Fleet_Manager)
    db_session.add(role)
    db_session.commit()
    
    user = User(email="test3@transitops.com", password_hash="dummy", role_id=role.id)
    db_session.add(user)
    db_session.commit()
    
    # 3 vehicles:
    # v1: fuel only
    v1 = Vehicle(registration_number="V1", model="M1", type="T1", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0)
    # v2: maintenance only
    v2 = Vehicle(registration_number="V2", model="M2", type="T2", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0)
    # v3: no expenses
    v3 = Vehicle(registration_number="V3", model="M3", type="T3", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0)
    db_session.add_all([v1, v2, v3])
    db_session.commit()
    
    # v1 has 2 fuel logs: 50.0 and 30.0 cost
    f1 = FuelLog(vehicle_id=v1.id, liters=20.0, cost=50.0, odometer_reading=120.0, created_by=user.id)
    f2 = FuelLog(vehicle_id=v1.id, liters=15.0, cost=30.0, odometer_reading=135.0, created_by=user.id)
    db_session.add_all([f1, f2])
    
    # v2 has 1 maintenance log: 200.0 cost
    m1 = MaintenanceLog(vehicle_id=v2.id, title="Oil Change", maintenance_type="Regular", cost=200.0, created_by=user.id)
    db_session.add(m1)
    db_session.commit()
    
    response = client.get("/analytics/operational-cost")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) == 3
    by_reg = {v["registration_number"]: v for v in data}
    
    assert by_reg["V1"]["fuel_cost"] == 80.0
    assert by_reg["V1"]["maintenance_cost"] == 0.0
    assert by_reg["V1"]["total_cost"] == 80.0
    
    assert by_reg["V2"]["fuel_cost"] == 0.0
    assert by_reg["V2"]["maintenance_cost"] == 200.0
    assert by_reg["V2"]["total_cost"] == 200.0
    
    assert by_reg["V3"]["fuel_cost"] == 0.0
    assert by_reg["V3"]["maintenance_cost"] == 0.0
    assert by_reg["V3"]["total_cost"] == 0.0


def test_fuel_efficiency_analytics(client, db_session):
    from app.models.user import User
    from app.models.role import Role
    from app.models.vehicle import Vehicle
    from app.models.driver import Driver
    from app.models.trip import Trip
    from app.models.fuel_log import FuelLog
    from app.enums import Roles, TripStatus
    
    role = Role(name=Roles.Fleet_Manager)
    db_session.add(role)
    db_session.commit()
    
    user = User(email="test4@transitops.com", password_hash="dummy", role_id=role.id)
    db_session.add(user)
    db_session.commit()
    
    driver = Driver(name="D1", license_number="L1", license_category="C1", license_expiry_date=datetime.date(2027, 12, 31), contact_number="123")
    db_session.add(driver)
    db_session.commit()
    
    # v1: completed trips and fuel
    v1 = Vehicle(registration_number="V1", model="M1", type="T1", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0)
    # v2: completed trips but zero fuel
    v2 = Vehicle(registration_number="V2", model="M2", type="T2", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0)
    db_session.add_all([v1, v2])
    db_session.commit()
    
    # Trips: v1 completed trip with 150 planned distance, and another draft trip (ignored)
    t1 = Trip(source="S1", destination="D1", vehicle_id=v1.id, driver_id=driver.id, cargo_weight=5.0, planned_distance=150.0, starting_odometer=100.0, status=TripStatus.Completed, created_by=user.id)
    t2 = Trip(source="S2", destination="D2", vehicle_id=v1.id, driver_id=driver.id, cargo_weight=5.0, planned_distance=50.0, starting_odometer=250.0, status=TripStatus.Draft, created_by=user.id)
    # v2 has completed trip with 100 distance
    t3 = Trip(source="S3", destination="D3", vehicle_id=v2.id, driver_id=driver.id, cargo_weight=5.0, planned_distance=100.0, starting_odometer=100.0, status=TripStatus.Completed, created_by=user.id)
    db_session.add_all([t1, t2, t3])
    db_session.commit()
    
    # Fuel log for v1: 30 liters
    f1 = FuelLog(vehicle_id=v1.id, liters=30.0, cost=60.0, odometer_reading=250.0, created_by=user.id)
    db_session.add(f1)
    db_session.commit()
    
    response = client.get("/analytics/fuel-efficiency")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) == 2
    by_reg = {v["registration_number"]: v for v in data}
    
    # v1 efficiency = 150 distance / 30 fuel = 5.0
    assert by_reg["V1"]["total_distance"] == 150.0
    assert by_reg["V1"]["total_fuel"] == 30.0
    assert by_reg["V1"]["efficiency"] == 5.0
    
    # v2 efficiency = 100 distance / 0 fuel = 0.0 (safely handled)
    assert by_reg["V2"]["total_distance"] == 100.0
    assert by_reg["V2"]["total_fuel"] == 0.0
    assert by_reg["V2"]["efficiency"] == 0.0


def test_export_vehicles_csv(client, db_session):
    from app.models.vehicle import Vehicle
    from app.enums import VehicleStatus
    
    # Seed a couple of vehicles
    v1 = Vehicle(registration_number="V1", model="M1", type="T1", max_load_capacity=10.0, odometer=100.0, acquisition_cost=10000.0, status=VehicleStatus.Available)
    v2 = Vehicle(registration_number="V2", model="M2", type="T2", max_load_capacity=12.0, odometer=150.0, acquisition_cost=12000.0, status=VehicleStatus.OnTrip)
    db_session.add_all([v1, v2])
    db_session.commit()
    
    response = client.get("/reports/export/vehicles")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8"
    assert "attachment; filename=vehicles_report.csv" in response.headers["content-disposition"]
    
    content = response.text
    reader = csv.reader(content.splitlines())
    rows = list(reader)
    
    assert len(rows) == 3
    assert rows[0] == ["registration_number", "model", "type", "status", "odometer", "acquisition_cost"]
    assert rows[1] == ["V1", "M1", "T1", "Available", "100.0", "10000.0"]
    assert rows[2] == ["V2", "M2", "T2", "On Trip", "150.0", "12000.0"]


def test_vehicle_roi(client, db_session):
    response = client.get("/analytics/roi")
    assert response.status_code == 200
    data = response.json()
    assert data == {"message": "Revenue data unavailable"}
    
    response2 = client.get("/analytics/vehicle-roi")
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2 == {"message": "Revenue data unavailable"}
