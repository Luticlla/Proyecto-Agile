-- ============================================
-- Rollback: Freeze v2
-- Revierte los cambios de migration-freeze-v2.sql
-- ============================================

ALTER TABLE public.suscripciones 
DROP COLUMN IF EXISTS freeze_fin,
DROP COLUMN IF EXISTS freeze_inicio;

ALTER TABLE public.planes_membresia 
DROP COLUMN IF EXISTS dias_freeze_maximo;

-- ============================================
-- FIN DE ROLLBACK
-- ============================================
