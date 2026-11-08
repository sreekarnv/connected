from datetime import datetime

from sqlalchemy import DateTime, FetchedValue, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy_declarative_extensions import declare_database
from sqlalchemy_declarative_extensions.dialects.postgresql import Function, Trigger
from sqlalchemy_declarative_extensions.function import Functions
from sqlalchemy_declarative_extensions.trigger import Triggers


class Base(DeclarativeBase):
    pass


_set_updated_at = Function(
    "set_updated_at",
    """
    BEGIN
        NEW.updated_at = statement_timestamp();
        RETURN NEW;
    END
    """,
    returns="trigger",
    language="plpgsql",
)

_update_timestamp = (
    Trigger.before("update", execute=_set_updated_at)
    .named("set_updated_at")
    .for_each_row()
)


declare_database(
    Base.metadata,
    functions=Functions(include=["set_updated_at"]),
    triggers=Triggers(include=["set_updated_at"]),
)


class TimestampMixin:
    __abstract__ = True
    __table_args__ = (_update_timestamp,)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        server_onupdate=FetchedValue(),
    )
