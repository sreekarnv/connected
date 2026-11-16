"""Persist verification delivery and install update timestamps."""

import sqlalchemy as sa

from alembic import op

revision = "56e2c91a0001"
down_revision = "44014f5c3de5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "email_verification_tokens", sa.Column("pending_token", sa.LargeBinary())
    )
    op.execute("""
        CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
        LANGUAGE plpgsql AS $$
        BEGIN
            NEW.updated_at = statement_timestamp();
            RETURN NEW;
        END;
        $$
    """)
    for table in ("users", "credentials"):
        op.execute(f"""
            CREATE OR REPLACE TRIGGER set_updated_at BEFORE UPDATE ON {table}
            FOR EACH ROW EXECUTE FUNCTION set_updated_at()
        """)


def downgrade() -> None:
    for table in ("users", "credentials"):
        op.execute(f"DROP TRIGGER set_updated_at ON {table}")
    op.execute("DROP FUNCTION set_updated_at()")
    op.drop_column("email_verification_tokens", "pending_token")
