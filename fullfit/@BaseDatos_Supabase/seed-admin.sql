-- Script para limpiar/borrar el usuario admin que falló en su creación.
-- Ejecuta esto en tu SQL Editor de Supabase para limpiar el estado corrupto.

DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- 1. Obtener el ID del usuario
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@fullforma.com' LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        -- 2. Eliminar de tablas relacionadas que podrían estar impidiendo el borrado en cascada
        DELETE FROM public.auditoria WHERE usuario_id = admin_id;
        DELETE FROM public.accesos WHERE usuario_id = admin_id;
        DELETE FROM public.accesos WHERE registrado_por = admin_id;
        DELETE FROM public.pagos WHERE usuario_id = admin_id;
        DELETE FROM public.pagos WHERE registrado_por = admin_id;
        DELETE FROM public.suscripciones WHERE usuario_id = admin_id;
        DELETE FROM public.suscripciones WHERE creado_por = admin_id;
        DELETE FROM public.notificaciones WHERE usuario_id = admin_id;
        
        -- 3. Eliminar de profiles (Aunque haya cascade desde auth.users, lo forzamos)
        DELETE FROM public.profiles WHERE id = admin_id;
        
        -- 4. Eliminar identidades asociadas
        DELETE FROM auth.identities WHERE user_id = admin_id;
        
        -- 5. Eliminar el usuario de la autenticación
        DELETE FROM auth.users WHERE id = admin_id;
        
        RAISE NOTICE 'Usuario admin@fullforma.com eliminado correctamente.';
    ELSE
        RAISE NOTICE 'No se encontró el usuario admin@fullforma.com.';
    END IF;
END $$;
