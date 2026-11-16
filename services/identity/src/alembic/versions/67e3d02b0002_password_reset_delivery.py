"""Persist encrypted password reset delivery intent."""

import sqlalchemy as sa

from alembic import op

revision = "67e3d02b0002"
down_revision = "56e2c91a0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("password_reset_tokens", sa.Column("pending_token", sa.LargeBinary()))


def downgrade() -> None:
    op.drop_column("password_reset_tokens", "pending_token")
