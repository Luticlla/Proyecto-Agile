-- ============================================
-- Migración: Freeze v2 — límite por tiempo y sesiones
-- Fecha: 2026-07-13
-- Descripción: Agrega columnas para controlar
--   duración máxima de freeze por plan y
--   fechas de inicio/fin del freeze activo.
-- ============================================

-- 1. Agregar columna dias_freeze_maximo a planes_membresia
ALTER TABLE public.planes_membresia 
ADD COLUMN dias_freeze_maximo integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.planes_membresia.dias_freeze_maximo 
IS 'Duración máxima en días de cada freeze según el plan (5 mensual, 30 trimestral, 60 anual)';

-- 2. Actualizar valores según plan
UPDATE public.planes_membresia SET dias_freeze_maximo = 5  WHERE nombre = 'Mensual';
UPDATE public.planes_membresia SET dias_freeze_maximo = 30 WHERE nombre = 'Trimestral';
UPDATE public.planes_membresia SET dias_freeze_maximo = 60 WHERE nombre = 'Anual';

-- 3. Agregar columnas a suscripciones para control de freeze activo
ALTER TABLE public.suscripciones 
ADD COLUMN freeze_inicio date,
ADD COLUMN freeze_fin date;

COMMENT ON COLUMN public.suscripciones.freeze_inicio 
IS 'Fecha de inicio del freeze activo (null si no está congelada)';
COMMENT ON COLUMN public.suscripciones.freeze_fin 
IS 'Fecha en que finaliza automáticamente el freeze activo (null si no está congelada)';

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================
