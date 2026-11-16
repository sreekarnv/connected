import sqlalchemy as sa

from alembic import op

revision = "a10f0d3e0003"
down_revision = "a10f0d3e0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "follows",
        sa.Column("follower_id", sa.Uuid(), nullable=False),
        sa.Column("followed_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["follower_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["followed_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("follower_id", "followed_id"),
        sa.CheckConstraint("follower_id <> followed_id", name="ck_follows_not_self"),
    )
    op.create_index(
        "ix_follows_followed_id_follower_id", "follows", ["followed_id", "follower_id"]
    )
    op.create_table(
        "blocks",
        sa.Column("blocker_id", sa.Uuid(), nullable=False),
        sa.Column("blocked_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["blocker_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["blocked_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("blocker_id", "blocked_id"),
        sa.CheckConstraint("blocker_id <> blocked_id", name="ck_blocks_not_self"),
    )


def downgrade() -> None:
    op.drop_table("blocks")
    op.drop_table("follows")
