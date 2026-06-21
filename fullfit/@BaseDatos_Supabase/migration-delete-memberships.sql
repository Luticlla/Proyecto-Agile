-- ============================================
-- Eliminar Membresías Específicas
-- Ejecutar en Supabase SQL Editor
-- Fecha: 2026-06-20
-- ============================================

-- 1. VER las membresías que se van a eliminar
SELECT 
  s.id,
  p.nombre,
  p.apellido,
  p.dni,
  s.estado,
  s.fecha_inicio,
  s.fecha_fin
FROM suscripciones s
JOIN profiles p ON p.id = s.usuario_id
WHERE p.dni IN ('12345679', '78945612');

-- 2. ELIMINAR pagos asociados a esas membresías
DELETE FROM pagos
WHERE suscripcion_id IN (
  SELECT s.id
  FROM suscripciones s
  JOIN profiles p ON p.id = s.usuario_id
  WHERE p.dni IN ('12345679', '78945612')
);

-- 3. ELIMINAR las membresías
DELETE FROM suscripciones
WHERE id IN (
  SELECT s.id
  FROM suscripciones s
  JOIN profiles p ON p.id = s.usuario_id
  WHERE p.dni IN ('12345679', '78945612')
);

-- 4. VERIFICAR que ya no existan
SELECT 
  p.nombre,
  p.apellido,
  p.dni,
  s.estado
FROM suscripciones s
JOIN profiles p ON p.id = s.usuario_id
WHERE p.dni IN ('12345679', '78945612');

-- ============================================
-- FIN
-- ============================================
