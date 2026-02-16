-- ============================================
-- InkSmith Studios: Users Table Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create enum type for roles
CREATE TYPE user_role AS ENUM ('admin', 'client', 'employee');

-- 2. Create users table linked to auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Helper function to get current user's role (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 5. RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all profiles (uses helper function to avoid infinite recursion)
CREATE POLICY "Admins can read all profiles" ON public.users
  FOR SELECT USING (public.get_my_role() = 'admin');

-- Users can update their own profile (name only, not role)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Trigger: auto-create user row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'role', '')::user_role,
      'client'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Backfill existing auth users into the users table
INSERT INTO public.users (id, name, email, role)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  au.email,
  COALESCE(
    NULLIF(au.raw_user_meta_data->>'role', '')::user_role,
    'client'
  )
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id);
