-- 1. Add New Columns for V2 Workflow
ALTER TABLE public.interview_experiences 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS term TEXT DEFAULT NULL, -- e.g. "Summer 2025"
ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified_student BOOLEAN DEFAULT FALSE;

-- 2. Update RLS Policies to allow "Edit & Resubmit" Flow

-- FIRST: Drop specific existing update policy if it conflicts (or relies on Admin only)
DROP POLICY IF EXISTS "Admins can update" ON public.interview_experiences;
DROP POLICY IF EXISTS "Contributors can update rejected" ON public.interview_experiences;

-- A. Admin Power: Can update ANY field for ANY row
CREATE POLICY "Admins can update" ON public.interview_experiences
FOR UPDATE
USING (public.is_admin());

-- B. Contributor Redemption: Can update OWN row ONLY IF it is currently 'rejected'
-- AND the resulting status MUST be 'pending' (forcing a re-review)
CREATE POLICY "Contributors can update rejected" ON public.interview_experiences
FOR UPDATE
USING (
  auth.uid() = contributor_id 
  AND status = 'rejected'
)
WITH CHECK (
  status = 'pending'
);

-- 3. Security Helper (Optional but good): Prevent unauthorized status promotion
-- (The WITH CHECK clause above handles the user case. Admins are trusted.)
