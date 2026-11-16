from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column

from connected_social.db.schema.base import Base


class Follow(Base):
    __tablename__ = "follows"
    __table_args__ = (
        CheckConstraint("follower_id <> followed_id", name="ck_follows_not_self"),
        Index("ix_follows_followed_id_follower_id", "followed_id", "follower_id"),
    )

    follower_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True
    )
    followed_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True
    )


class Block(Base):
    __tablename__ = "blocks"
    __table_args__ = (
        CheckConstraint("blocker_id <> blocked_id", name="ck_blocks_not_self"),
    )

    blocker_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True
    )
    blocked_id: Mapped[UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True
    )
