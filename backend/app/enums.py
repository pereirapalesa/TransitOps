from enum import Enum

class Roles(str, Enum):
    Driver = "Driver"
    Fleet_Manager = "Fleet Manager"
    Safety_Officer = "Safety Officer"
    Financial_Analyst = "Financial Analyst"

class VehicleStatus(str, Enum):
    Available = "Available"
    OnTrip = "On Trip"
    InShop = "In Shop"
    Retired = "Retired"

class DriverStatus(str, Enum):
    Available = "Available"
    OnTrip = "On Trip"
    OffDuty = "Off Duty"
    Suspended = "Suspended"

class TripStatus(str, Enum):
    Draft = "Draft"
    Dispatched = "Dispatched"
    Completed = "Completed"
    Cancelled = "Cancelled"

class MaintenanceStatus(str, Enum):
    OPEN = "OPEN"
    COMPLETED = "COMPLETED"

class ExpenseCategory(str, Enum):
    Fuel = "Fuel"
    Maintenance = "Maintenance"
    Toll = "Toll"
    Other = "Other"
