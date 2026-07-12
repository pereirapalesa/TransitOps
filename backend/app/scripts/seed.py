from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.enums import Roles
from app.core.auth import hash_password


def seed_roles(db: Session):
    roles = [
        Roles.Driver,
        Roles.Fleet_Manager,
        Roles.Safety_Officer,
        Roles.Financial_Analyst,
    ]

    created_roles = {}

    for role_name in roles:
        role = (
            db.query(Role)
            .filter(Role.name == role_name)
            .first()
        )

        if not role:
            role = Role(name=role_name)
            db.add(role)
            db.commit()
            db.refresh(role)

        created_roles[role_name] = role

    return created_roles


def seed_users(db: Session, roles):

    users = [
        {
            "email": "fleet@transitops.com",
            "password": "fleet123",
            "role": Roles.Fleet_Manager,
        },
        {
            "email": "driver@transitops.com",
            "password": "driver123",
            "role": Roles.Driver,
        },
        {
            "email": "safety@transitops.com",
            "password": "safety123",
            "role": Roles.Safety_Officer,
        },
        {
            "email": "finance@transitops.com",
            "password": "finance123",
            "role": Roles.Financial_Analyst,
        },
    ]


    for item in users:

        existing = (
            db.query(User)
            .filter(User.email == item["email"])
            .first()
        )

        if existing:
            continue


        user = User(
            email=item["email"],
            password_hash=hash_password(item["password"]),
            role_id=roles[item["role"]].id
        )

        db.add(user)

    db.commit()


def main():

    db = SessionLocal()

    try:
        roles = seed_roles(db)
        seed_users(db, roles)

        print("Database seeded successfully")

    finally:
        db.close()


if __name__ == "__main__":
    main()