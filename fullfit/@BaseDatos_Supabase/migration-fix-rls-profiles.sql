-- ============================================
-- Migración: Corregir recursión infinita en RLS de profiles
-- Fecha: 2026-06-20
-- Descripción: Crea función security definer y políticas RLS correctas
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Eliminar políticas existentes que causan recursión
DROP POLICY IF EXISTS "recepcionistas_select_all_profiles" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_update_all_profiles" ON profiles;

-- 2. Crear función security definer para obtener el rol del usuario
-- Esta función bypass RLS porque es SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT rol_id FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

-- 3. Otorgar permisos de ejecución a authenticated
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;

-- 4. Crear políticas RLS usando la función (sin recursión)
CREATE POLICY "recepcionistas_select_all_profiles" ON profiles
FOR SELECT TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2)
);

CREATE POLICY "recepcionistas_update_all_profiles" ON profiles
FOR UPDATE TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2)
)
WITH CHECK (true);

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================
