"""migrate_to_openrouter_api

Revision ID: b17cc4a502fb
Revises: 
Create Date: 2025-11-13 20:52:04.101903

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b17cc4a502fb'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Migrate from separate API keys to unified OpenRouter API key."""
    # Add the new openrouter_api_key column
    op.add_column('app_settings', sa.Column('openrouter_api_key', sa.Text(), nullable=True))
    
    # Optional: Copy data from anthropic_api_key to openrouter_api_key if needed
    # op.execute("UPDATE app_settings SET openrouter_api_key = anthropic_api_key WHERE anthropic_api_key IS NOT NULL AND anthropic_api_key != ''")
    
    # Drop the old API key columns
    op.drop_column('app_settings', 'google_api_key')
    op.drop_column('app_settings', 'openai_api_key')
    op.drop_column('app_settings', 'anthropic_api_key')


def downgrade() -> None:
    """Rollback to separate API keys."""
    # Re-add the old API key columns
    op.add_column('app_settings', sa.Column('anthropic_api_key', sa.Text(), nullable=True))
    op.add_column('app_settings', sa.Column('openai_api_key', sa.Text(), nullable=True))
    op.add_column('app_settings', sa.Column('google_api_key', sa.Text(), nullable=True))
    
    # Optional: Copy data back from openrouter_api_key to anthropic_api_key if needed
    # op.execute("UPDATE app_settings SET anthropic_api_key = openrouter_api_key WHERE openrouter_api_key IS NOT NULL AND openrouter_api_key != ''")
    
    # Drop the new openrouter_api_key column
    op.drop_column('app_settings', 'openrouter_api_key')

