-- REEMPLAZA TU CORREO ABAJO Y EJECÚTALO PARA DARTE PERMISOS DE ADMIN
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'TU_CORREO_AQUI' LIMIT 1
);
