-- ============================================
-- Limpieza de Membresías Duplicadas
-- Ejecutar en Supabase SQL Editor
-- Fecha: 2026-06-20
-- ============================================

-- 1. VER duplicados ANTES de limpiar
-- Muestra todos los usuarios con más de 1 membresía activa
SELECT 
  usuario_id,
  COUNT(*) as total_activas,
  ARRAY_AGG(id ORDER BY fecha_fin DESC) as ids,
  ARRAY_AGG(fecha_fin ORDER BY fecha_fin DESC) as fechas_fin
FROM suscripciones
WHERE estado = 'activa'
GROUP BY usuario_id
HAVING COUNT(*) > 1;

-- 2. CANCELAR membresías duplicadas
-- Para cada usuario con múltiples activas, mantener solo la de mayor fecha_fin
UPDATE suscripciones
SET estado = 'cancelada'
WHERE id IN (
  SELECT id FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY usuario_id 
        ORDER BY fecha_fin DESC
      ) as rn
    FROM suscripciones
    WHERE estado = 'activa'
  ) ranked
  WHERE rn > 1
);

-- 3. VERIFICAR resultado
-- Debe mostrar 0 duplicados
SELECT 
  usuario_id,
  COUNT(*) as total_activas
FROM suscripciones
WHERE estado = 'activa'
GROUP BY usuario_id
HAVING COUNT(*) > 1;

-- ============================================
-- FIN DE LIMPIEZA
-- ============================================
