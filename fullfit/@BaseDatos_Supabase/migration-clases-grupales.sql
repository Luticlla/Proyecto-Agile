-- Migración: Agregar columnas de clases grupales a la tabla sedes
-- Yoga: 10:00 - 11:00 (Lunes a Viernes)
-- MMA: 19:00 - 20:00 (Lunes a Viernes)

ALTER TABLE public.sedes
  ADD COLUMN clase_yoga_inicio time without time zone DEFAULT '10:00:00',
  ADD COLUMN clase_yoga_fin time without time zone DEFAULT '11:00:00',
  ADD COLUMN clase_mma_inicio time without time zone DEFAULT '19:00:00',
  ADD COLUMN clase_mma_fin time without time zone DEFAULT '20:00:00';

-- Actualizar la sede existente con los horarios de clases
UPDATE public.sedes SET
  clase_yoga_inicio = '10:00:00',
  clase_yoga_fin = '11:00:00',
  clase_mma_inicio = '19:00:00',
  clase_mma_fin = '20:00:00'
WHERE nombre = 'Full Forma';
