from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.enums import Roles

class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[Roles] = mapped_column(
        Enum(Roles, name="role_enum"),
        nullable=False,
        default=Roles.Driver,
    )

    users = relationship("User", back_populates="role")