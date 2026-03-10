-- 1. Create the user_roles table
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Users can read their own role
CREATE POLICY "Users can read their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins can read all roles
CREATE POLICY "Admins can read all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING ((SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin');

-- Admins can update roles
CREATE POLICY "Admins can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING ((SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin');

-- 4. Create a trigger to automatically assign the 'user' role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Create a secure view for Admins to see user emails and roles
-- Since auth.users is in a secure schema, we map it so the frontend can query it (only for admins)
CREATE OR REPLACE VIEW public.admin_user_view AS
SELECT 
  au.id, 
  au.email, 
  ur.role, 
  ur.created_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id;

-- Grant access to the view only to authenticated users (RLS on underlying table protects it, but we can manage it tighter)
GRANT SELECT ON public.admin_user_view TO authenticated;
GRANT SELECT ON public.admin_user_view TO service_role;

-- Important Note on View: PostgreSQL Views over secure schemas might bypass RLS if not careful,
-- but auth.users isn't RLS protected in the same way, the entire schema is restricted.
-- To be safe, we wrap it in a Security Definer function instead, which is more secure:
DROP VIEW IF EXISTS public.admin_user_view;

CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (id UUID, email VARCHAR, role TEXT, created_at TIMESTAMPTZ) 
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF (SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = auth.uid()) = 'admin' THEN
    RETURN QUERY 
    SELECT 
      au.id, 
      au.email::VARCHAR, 
      ur.role, 
      ur.created_at
    FROM auth.users au
    LEFT JOIN public.user_roles ur ON au.id = ur.user_id;
  ELSE
    RAISE EXCEPTION 'Not authorized';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 6. [MANUAL ACTION REQUIRED]
-- Run the following line manually replacing 'YOUR-EMAIL@DOMAIN.COM' to elevate your own user to admin:
-- UPDATE public.user_roles SET role = 'admin' WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@DOMAIN.COM');
