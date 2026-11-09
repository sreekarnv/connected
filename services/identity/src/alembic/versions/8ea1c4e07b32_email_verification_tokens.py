"""Add email verification state and single-use tokens."""

import sqlalchemy as sa

from alembic import op

revision = "8ea1c4e07b32"
down_revision = "56d4f389ab10"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("email_verified_at", sa.DateTime(timezone=True)))
    op.create_table(
        "email_verification_tokens",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token_hash", sa.String(64), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("user_id"),
        sa.UniqueConstraint("token_hash"),
    )


def downgrade() -> None:
    op.drop_table("email_verification_tokens")
    op.drop_column("users", "email_verified_at")
