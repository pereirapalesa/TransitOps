from pydantic import BaseModel, Field, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserRoleSchema(BaseModel):
    id: str
    name: str

class UserInfoResponse(BaseModel):
    id: str
    organization_id: str = "local-org"
    full_name: str
    email: str
    is_active: bool = True
    last_login: str | None = None
    role: UserRoleSchema

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfoResponse