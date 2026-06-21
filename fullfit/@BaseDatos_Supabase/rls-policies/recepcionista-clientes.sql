-- ============================================
-- Políticas RLS: Recepcionista - Clientes
-- Versión corregida sin recursividad
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Habilitar RLS en otras tablas
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accesos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ELIMINAR POLÍTICAS EXISTENTES (si existen)
-- ============================================
DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_select_profiles" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_update_profiles" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_select_all_profiles" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_update_all_profiles" ON profiles;

-- ============================================
-- POLÍTICAS PARA PROFILES (sin recursividad)
-- ============================================

-- Función security definer para obtener el rol del usuario (bypass RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT rol_id FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

-- Otorgar permisos de ejecución a authenticated
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;

-- Policy 1: Cada usuario puede ver su propio perfil
CREATE POLICY "users_select_own_profile" ON profiles
FOR SELECT TO authenticated
USING (id = auth.uid());

-- Policy 2: Cada usuario puede actualizar su propio perfil
CREATE POLICY "users_update_own_profile" ON profiles
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Policy 3: Recepcionistas y admin pueden ver todos los perfiles (usando función sin recursión)
CREATE POLICY "recepcionistas_select_all_profiles" ON profiles
FOR SELECT TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2)
);

-- Policy 4: Recepcionistas y admin pueden actualizar perfiles de clientes
CREATE POLICY "recepcionistas_update_all_profiles" ON profiles
FOR UPDATE TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2)
)
WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA SUSCRIPCIONES
-- ============================================

DROP POLICY IF EXISTS "recepcionistas_select_suscripciones" ON suscripciones;
DROP POLICY IF EXISTS "recepcionistas_insert_suscripciones" ON suscripciones;
DROP POLICY IF EXISTS "recepcionistas_update_suscripciones" ON suscripciones;

CREATE POLICY "recepcionistas_select_suscripciones" ON suscripciones
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "recepcionistas_insert_suscripciones" ON suscripciones
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "recepcionistas_update_suscripciones" ON suscripciones
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA PAGOS
-- ============================================

DROP POLICY IF EXISTS "recepcionistas_select_pagos" ON pagos;
DROP POLICY IF EXISTS "recepcionistas_insert_pagos" ON pagos;

CREATE POLICY "recepcionistas_select_pagos" ON pagos
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "recepcionistas_insert_pagos" ON pagos
FOR INSERT TO authenticated
WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA ACCESOS
-- ============================================

DROP POLICY IF EXISTS "recepcionistas_select_accesos" ON accesos;
DROP POLICY IF EXISTS "recepcionistas_insert_accesos" ON accesos;

CREATE POLICY "recepcionistas_select_accesos" ON accesos
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "recepcionistas_insert_accesos" ON accesos
FOR INSERT TO authenticated
WITH CHECK (true);

-- ============================================
-- FIN DE POLÍTICAS
-- ============================================