-- 1. Eliminar las políticas que están causando la recursión
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

-- 2. Crear una función "Security Definer" para verificar si es admin sin lanzar el RLS infinito
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 3. Volver a crear las políticas usando la nueva función segura
CREATE POLICY "Admins can read all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (public.is_admin());
