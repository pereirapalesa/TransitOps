from enum import Enum

class Roles(str, Enum):
    Driver = "Driver"
    Fleet_Manager = "Fleet Manager"
    Safety_Officer = "Safety Officer"
    Financial_Analyst = "Financial Analyst"