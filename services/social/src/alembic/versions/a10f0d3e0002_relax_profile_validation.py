from alembic import op

revision = "a10f0d3e0002"
down_revision = "a10f0d3e0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("ck_profiles_handle", "profiles", type_="check")
    op.drop_constraint("ck_profiles_display_name", "profiles", type_="check")


def downgrade() -> None:
    op.create_check_constraint(
        "ck_profiles_handle",
        "profiles",
        "handle COLLATE \"C\" ~ '^[a-z][a-z0-9_]{2,29}$'",
    )
    op.create_check_constraint(
        "ck_profiles_display_name",
        "profiles",
        "char_length(display_name) BETWEEN 1 AND 100 "
        "AND display_name = btrim(display_name) "
        "AND display_name !~ '^[[:space:]]|[[:space:]]$'",
    )
