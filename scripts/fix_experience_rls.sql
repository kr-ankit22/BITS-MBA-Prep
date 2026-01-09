-- Enable RLS on the table
ALTER TABLE public.interview_experiences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Public can view approved experiences" ON public.interview_experiences;
DROP POLICY IF EXISTS "Contributors can view own experiences" ON public.interview_experiences;
DROP POLICY IF EXISTS "Authenticated users can submit experiences" ON public.interview_experiences;
DROP POLICY IF EXISTS "Admins can do everything" ON public.interview_experiences;
DROP POLICY IF EXISTS "Admins can update experiences" ON public.interview_experiences; -- Specific one causing the bug

-- 1. Read Policy: 
-- Public/Anyone can see 'approved' experiences.
-- Contributors can see their own experiences (even if pending).
-- Admins can see ALL experiences (via is_admin() function).
CREATE POLICY "Read Access Strategy" ON public.interview_experiences
FOR SELECT
USING (
  status = 'approved' 
  OR 
  (auth.uid() = contributor_id)
  OR
  (EXTRACT(epoch FROM now()) > 0 AND public.is_admin()) -- Use robust admin check
);

-- 2. Insert Policy:
-- Authenticated users can submit (pending typically).
CREATE POLICY "Authenticated users can submit" ON public.interview_experiences
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 3. Update Policy:
-- Only Admins can update status or details.
CREATE POLICY "Admins can update" ON public.interview_experiences
FOR UPDATE
USING (public.is_admin());

-- 4. Delete Policy:
-- Only Admins can delete.
CREATE POLICY "Admins can delete" ON public.interview_experiences
FOR DELETE
USING (public.is_admin());
