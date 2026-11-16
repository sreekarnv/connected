import sqlalchemy as sa

from alembic import op

revision = "a10f0d3e0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "profiles",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("handle", sa.String(30), nullable=False),
        sa.Column("display_name", sa.String(100), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("handle", name="uq_profiles_handle"),
        sa.CheckConstraint(
            "handle COLLATE \"C\" ~ '^[a-z][a-z0-9_]{2,29}$'",
            name="ck_profiles_handle",
        ),
        sa.CheckConstraint(
            "char_length(display_name) BETWEEN 1 AND 100 "
            "AND display_name = btrim(display_name) "
            "AND display_name !~ '^[[:space:]]|[[:space:]]$'",
            name="ck_profiles_display_name",
        ),
    )


def downgrade() -> None:
    op.drop_table("profiles")
