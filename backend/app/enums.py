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