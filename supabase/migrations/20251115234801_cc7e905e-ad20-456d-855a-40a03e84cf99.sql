-- Add round column to fixtures table to track fixture rounds
ALTER TABLE fixtures ADD COLUMN round INTEGER NOT NULL DEFAULT 1;

-- Add index for better query performance
CREATE INDEX idx_fixtures_round ON fixtures(season_id, round);