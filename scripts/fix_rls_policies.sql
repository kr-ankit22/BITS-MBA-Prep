-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete" ON public.user_roles;

-- Redefine is_admin with case-insensitivity and robust checking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE lower(email) = lower(auth.jwt() ->> 'email')
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create Policies

-- 1. Read Policy: Users can read their own role (Case insensitive)
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT
  USING (lower(auth.jwt() ->> 'email') = lower(email));

-- 2. Admin Read Policy: Admins can read all roles.
CREATE POLICY "Admins can read all" ON public.user_roles
  FOR SELECT
  USING (is_admin());

-- 3. Admin Write Policies
CREATE POLICY "Admins can insert" ON public.user_roles
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update" ON public.user_roles
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete" ON public.user_roles
  FOR DELETE
  USING (is_admin());
