-- Migración: Actualizar columnas de clases grupales en la tabla sedes
-- Funcional: 10:00 - 11:00 (Lunes a Viernes)
-- Gap: 19:00 - 20:00 (Lunes a Viernes)

-- Eliminar columnas antiguas
ALTER TABLE public.sedes
  DROP COLUMN IF EXISTS clase_yoga_inicio,
  DROP COLUMN IF EXISTS clase_yoga_fin,
  DROP COLUMN IF EXISTS clase_mma_inicio,
  DROP COLUMN IF EXISTS clase_mma_fin;

-- Agregar nuevas columnas para Funcional
ALTER TABLE public.sedes
  ADD COLUMN clase_funcional_inicio time without time zone DEFAULT '10:00:00',
  ADD COLUMN clase_funcional_fin time without time zone DEFAULT '11:00:00';

-- Agregar nuevas columnas para Gap
ALTER TABLE public.sedes
  ADD COLUMN clase_gap_inicio time without time zone DEFAULT '19:00:00',
  ADD COLUMN clase_gap_fin time without time zone DEFAULT '20:00:00';

-- Actualizar la sede existente con los horarios de clases
UPDATE public.sedes SET
  clase_funcional_inicio = '10:00:00',
  clase_funcional_fin = '11:00:00',
  clase_gap_inicio = '19:00:00',
  clase_gap_fin = '20:00:00'
WHERE nombre = 'Full Forma';
