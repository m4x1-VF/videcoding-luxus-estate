-- Permitir a los usuarios insertar su propio rol (necesario para cuando se autentican por primera vez si no lo tenían)
CREATE POLICY "Users can insert their own role" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
