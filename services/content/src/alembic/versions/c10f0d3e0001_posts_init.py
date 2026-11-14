import sqlalchemy as sa

from alembic import op

revision = "c10f0d3e0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "posts",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("author_id", sa.Uuid(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint(
            "char_length(body) BETWEEN 1 AND 5000", name="ck_posts_body_length"
        ),
    )
    op.create_index("ix_posts_created_at_id", "posts", ["created_at", "id"])


def downgrade() -> None:
    op.drop_index("ix_posts_created_at_id", table_name="posts")
    op.drop_table("posts")
