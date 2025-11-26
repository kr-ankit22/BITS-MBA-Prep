-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('google', 'local')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin (Bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE email = (auth.jwt() ->> 'email')
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies

-- 1. Read Policy: Users can read their own role.
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- 2. Admin Read Policy: Admins can read all roles.
CREATE POLICY "Admins can read all" ON public.user_roles
  FOR SELECT
  USING (is_admin());

-- 3. Admin Write Policies: Only Admins can insert/update/delete.
CREATE POLICY "Admins can insert" ON public.user_roles
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update" ON public.user_roles
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete" ON public.user_roles
  FOR DELETE
  USING (is_admin());

-- Bootstrap: Insert the first Admin user (Replace with your actual email if different)
-- Assuming the user's email from context or a placeholder.
-- Using a generic placeholder that the user should update or I can try to guess.
-- I'll use a placeholder and ask the user to verify.
INSERT INTO public.user_roles (email, role, auth_provider, full_name)
VALUES ('h20240806@pilani.bits-pilani.ac.in', 'admin', 'google', 'System Admin')
ON CONFLICT (email) DO NOTHING;
