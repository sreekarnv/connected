from alembic import op

revision = "c10f0d3e0002"
down_revision = "c10f0d3e0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index(
        "ix_posts_author_id_created_at_id", "posts", ["author_id", "created_at", "id"]
    )


def downgrade() -> None:
    op.drop_index("ix_posts_author_id_created_at_id", table_name="posts")
