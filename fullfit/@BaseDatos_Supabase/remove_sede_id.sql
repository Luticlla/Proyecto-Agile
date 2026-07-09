-- MIGRACIÓN PARA ELIMINAR LA RELACIÓN CON SEDES DE TODAS LAS TABLAS

-- 1. Eliminar restricciones (constraints y foreign keys)
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_sede_id_fkey;
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_sede_id_roles_check;
ALTER TABLE IF EXISTS public.suscripciones DROP CONSTRAINT IF EXISTS suscripciones_sede_id_fkey;
ALTER TABLE IF EXISTS public.pagos DROP CONSTRAINT IF EXISTS pagos_sede_id_fkey;
ALTER TABLE IF EXISTS public.accesos DROP CONSTRAINT IF EXISTS accesos_sede_id_fkey;

-- 2. Eliminar índices asociados
DROP INDEX IF EXISTS public.idx_profiles_sede_id;
DROP INDEX IF EXISTS public.idx_suscripciones_sede_id;
DROP INDEX IF EXISTS public.idx_pagos_sede_id;
DROP INDEX IF EXISTS public.idx_accesos_sede_id;

-- 3. Eliminar la columna sede_id de todas las tablas transaccionales usando CASCADE
ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS sede_id CASCADE;
ALTER TABLE IF EXISTS public.suscripciones DROP COLUMN IF EXISTS sede_id CASCADE;
ALTER TABLE IF EXISTS public.pagos DROP COLUMN IF EXISTS sede_id CASCADE;
ALTER TABLE IF EXISTS public.accesos DROP COLUMN IF EXISTS sede_id CASCADE;

-- 4. Eliminar la función helper que obtenía la sede del usuario usando CASCADE
DROP FUNCTION IF EXISTS public.get_user_sede_id(UUID) CASCADE;

-- 5. Actualizar políticas de RLS que usaban get_user_sede_id()
-- Nota: En un entorno de una sola sede, probablemente los roles 1 y 2 (admin/recepcionista)
-- pueden ver todos los registros, y el rol 3 (miembro) solo los suyos.

-- PROFILES RLS
DROP POLICY IF EXISTS "Perfiles visibles según rol y sede" ON public.profiles;
DROP POLICY IF EXISTS "Perfiles visibles según rol" ON public.profiles;
CREATE POLICY "Perfiles visibles según rol" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() 
    OR public.get_user_role(auth.uid()) IN (1, 2)
  );

-- SUSCRIPCIONES RLS
DROP POLICY IF EXISTS "Suscripciones visibles por sede" ON public.suscripciones;
DROP POLICY IF EXISTS "Suscripciones visibles por rol" ON public.suscripciones;
CREATE POLICY "Suscripciones visibles por rol" ON public.suscripciones
  FOR SELECT USING (
    usuario_id = auth.uid()
    OR public.get_user_role(auth.uid()) IN (1, 2)
  );

-- PAGOS RLS
DROP POLICY IF EXISTS "Pagos visibles por sede" ON public.pagos;
DROP POLICY IF EXISTS "Pagos visibles por rol" ON public.pagos;
CREATE POLICY "Pagos visibles por rol" ON public.pagos
  FOR SELECT USING (
    usuario_id = auth.uid()
    OR public.get_user_role(auth.uid()) IN (1, 2)
  );

-- ACCESOS RLS
DROP POLICY IF EXISTS "Accesos visibles por sede" ON public.accesos;
DROP POLICY IF EXISTS "Accesos visibles por rol" ON public.accesos;
CREATE POLICY "Accesos visibles por rol" ON public.accesos
  FOR SELECT USING (
    usuario_id = auth.uid()
    OR public.get_user_role(auth.uid()) IN (1, 2)
  );
