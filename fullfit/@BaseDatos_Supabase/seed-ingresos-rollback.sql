-- ============================================
-- Rollback: Seed de ingresos de prueba
-- Elimina los pagos generados por seed-ingresos.sql
-- ============================================

DELETE FROM public.pagos 
WHERE observaciones = 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA'
  AND estado = 'completado';

-- ============================================
-- FIN DE ROLLBACK
-- ============================================
