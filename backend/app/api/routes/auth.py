from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload

from app.deps import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.auth import (
    verify_password,
    create_access_token,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login", response_model=TokenResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .options(joinedload(User.role))
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    token = create_access_token({
        "sub": str(user.id),
        "role": user.role.name.value if user.role else "Driver"
    })

    local = user.email.split("@")[0] if "@" in user.email else "user"
    full_name = " ".join([part.capitalize() for part in local.replace(".", " ").replace("_", " ").replace("-", " ").split()])
    role_name = user.role.name.value if user.role else "Driver"
    role_id = f"role-{role_name.lower().replace(' ', '-')}"

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "organization_id": "local-org",
            "full_name": full_name,
            "email": user.email,
            "is_active": user.is_active,
            "last_login": None,
            "role": {
                "id": role_id,
                "name": role_name
            }
        }
    }


@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .options(joinedload(User.role))
        .filter(User.email == form_data.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role.name.value if user.role else "Driver"
    })

    local = user.email.split("@")[0] if "@" in user.email else "user"
    full_name = " ".join([part.capitalize() for part in local.replace(".", " ").replace("_", " ").replace("-", " ").split()])
    role_name = user.role.name.value if user.role else "Driver"
    role_id = f"role-{role_name.lower().replace(' ', '-')}"

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "organization_id": "local-org",
            "full_name": full_name,
            "email": user.email,
            "is_active": user.is_active,
            "last_login": None,
            "role": {
                "id": role_id,
                "name": role_name
            }
        }
    }


from app.deps import get_current_user
from app.schemas.auth import UserInfoResponse

@router.get("/me", response_model=UserInfoResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    local = current_user.email.split("@")[0] if "@" in current_user.email else "user"
    full_name = " ".join([part.capitalize() for part in local.replace(".", " ").replace("_", " ").replace("-", " ").split()])
    role_name = current_user.role.name.value if current_user.role else "Driver"
    role_id = f"role-{role_name.lower().replace(' ', '-')}"

    return {
        "id": str(current_user.id),
        "organization_id": "local-org",
        "full_name": full_name,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "last_login": None,
        "role": {
            "id": role_id,
            "name": role_name
        }
    }