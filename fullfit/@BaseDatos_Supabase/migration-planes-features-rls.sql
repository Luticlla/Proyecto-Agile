-- ============================================
-- Migración: Agregar features a planes_membresia + RLS
-- Fecha: 2026-07-05
-- Descripción: Agrega columna features (JSONB) y políticas RLS
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Agregar columna features
ALTER TABLE public.planes_membresia 
ADD COLUMN features jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.planes_membresia.features 
IS 'Lista de beneficios/features del plan en formato JSON array';

-- 2. Habilitar RLS en planes_membresia
ALTER TABLE public.planes_membresia ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes (si existen)
DROP POLICY IF EXISTS "gerente_manage_planes" ON planes_membresia;
DROP POLICY IF EXISTS "public_select_planes" ON planes_membresia;

-- 4. Política: Solo admin/gerente puede INSERT/UPDATE/DELETE
CREATE POLICY "gerente_manage_planes" ON planes_membresia
FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 1)
WITH CHECK (public.get_user_role(auth.uid()) = 1);

-- 5. Política: Todos pueden SELECT (público)
CREATE POLICY "public_select_planes" ON planes_membresia
FOR SELECT TO anon, authenticated
USING (true);

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================
