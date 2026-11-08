import uuid

from sqlalchemy import UUID, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column

from connected_identity.db.schema.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID, primary_key=True, nullable=False, default=func.gen_random_uuid()
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)


Index("ix_users_email_normalized", func.lower(func.btrim(User.email)), unique=True)


class Credential(Base, TimestampMixin):
    __tablename__ = "credentials"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID, primary_key=True, nullable=False, default=func.gen_random_uuid()
    )
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID, ForeignKey("users.id"), nullable=False, unique=True
    )
