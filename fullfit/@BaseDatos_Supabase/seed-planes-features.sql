-- ============================================
-- Seed: Migrar features de constants/plans.ts a BD
-- Fecha: 2026-07-05
-- Descripción: Inserta features existentes en la columna JSONB
-- Ejecutar en Supabase SQL Editor DESPUÉS de la migración
-- ============================================

-- Plan Mensual
UPDATE planes_membresia 
SET features = '["Acceso a todas las sedes","Área de pesas y máquinas","Vestuarios y locker","App de seguimiento"]'::jsonb 
WHERE nombre = 'Mensual';

-- Plan Trimestral
UPDATE planes_membresia 
SET features = '["Acceso a todas las sedes","Área de pesas y máquinas","Clases grupales ilimitadas","App de seguimiento","Evaluación corporal mensual"]'::jsonb 
WHERE nombre = 'Trimestral';

-- Plan Anual
UPDATE planes_membresia 
SET features = '["Acceso a todas las sedes","Área de pesas y máquinas","Clases grupales ilimitadas","App de seguimiento","Evaluación corporal mensual","2 días de freeze","Acceso prioritario a eventos"]'::jsonb 
WHERE nombre = 'Anual';

-- ============================================
-- FIN DE SEED
-- ============================================
