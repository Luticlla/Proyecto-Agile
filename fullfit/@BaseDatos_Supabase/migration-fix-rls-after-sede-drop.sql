-- ============================================
-- Migración: Arreglar RLS tras eliminar profiles.sede_id
-- Fecha: 2026-07-08
-- Descripción: Recrea get_user_sede_id y verifica políticas RLS
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Recrear get_user_sede_id sin depender de profiles.sede_id
--    Ahora busca la sede en suscripciones (para miembros)
--    Para staff retorna NULL (su sede se maneja en la aplicación)
DROP FUNCTION IF EXISTS public.get_user_sede_id(UUID);
CREATE OR REPLACE FUNCTION public.get_user_sede_id(user_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT sede_id FROM public.suscripciones 
  WHERE usuario_id = user_id 
  ORDER BY creado_en DESC LIMIT 1;
$$;

-- 2. Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION public.get_user_sede_id(UUID) TO authenticated;

-- 3. Verificar y recrear políticas de profiles si no existen
DO $$ 
BEGIN
  -- Política para que staff (rol 1,2) pueda VER todos los perfiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'recepcionistas_select_all_profiles' 
    AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "recepcionistas_select_all_profiles" ON profiles
    FOR SELECT TO authenticated
    USING (public.get_user_role(auth.uid()) IN (1, 2));
  END IF;

  -- Política para que staff (rol 1,2) pueda EDITAR todos los perfiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'recepcionistas_update_all_profiles' 
    AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "recepcionistas_update_all_profiles" ON profiles
    FOR UPDATE TO authenticated
    USING (public.get_user_role(auth.uid()) IN (1, 2))
    WITH CHECK (true);
  END IF;
END $$;

-- 4. Arreglar política de sedes para staff
--    La política anterior usaba get_user_sede_id() que retorna NULL para staff
--    Ahora permitimos que staff vea TODAS las sedes (el admin ya puede con admin_manage_sedes)
DROP POLICY IF EXISTS "staff_select_own_sede" ON sedes;
CREATE POLICY "staff_select_own_sede" ON sedes
FOR SELECT TO authenticated
USING (public.get_user_role(auth.uid()) IN (1, 2));

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================
