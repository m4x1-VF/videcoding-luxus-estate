-- Sincronizar todos los usuarios existentes en auth.users que no tengan rol
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles);
