-- Add JSONB column for storing complex rounds data
ALTER TABLE interview_experiences
ADD COLUMN IF NOT EXISTS rounds_snapshot JSONB;

-- Add Status column for review workflow
ALTER TABLE interview_experiences
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';

-- Add Contributor ID for tracking who submitted
ALTER TABLE interview_experiences
ADD COLUMN IF NOT EXISTS contributor_id UUID REFERENCES auth.users(id);

-- Optional: Create an index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_interview_status ON interview_experiences(status);
