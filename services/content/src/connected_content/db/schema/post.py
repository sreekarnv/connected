from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, DateTime, Index, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from connected_content.db.schema.base import Base


class Post(Base):
    __tablename__ = "posts"
    __table_args__ = (
        CheckConstraint(
            "char_length(body) BETWEEN 1 AND 5000", name="ck_posts_body_length"
        ),
        Index("ix_posts_created_at_id", "created_at", "id"),
        Index("ix_posts_author_id_created_at_id", "author_id", "created_at", "id"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    author_id: Mapped[UUID] = mapped_column(nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
