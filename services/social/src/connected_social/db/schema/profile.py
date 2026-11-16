from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from connected_social.db.schema.base import Base


class Profile(Base):
    __tablename__ = "profiles"
    __table_args__ = (UniqueConstraint("handle", name="uq_profiles_handle"),)

    id: Mapped[UUID] = mapped_column(primary_key=True)
    handle: Mapped[str] = mapped_column(String(30), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
