-- ============================================
-- Seed de ingresos de prueba (junio 2026)
-- Genera pagos en distintas fechas/horas para
-- poblar el gráfico de línea de ingresos.
-- Se elimina con seed-ingresos-rollback.sql
-- ============================================

-- ============================================
-- Pagos variados de junio 2026
-- Distribución por días y horas para
-- visualizar correctamente el gráfico
-- ============================================

-- Día 1: Lunes 1 Jun - 6 pagos en distintas horas
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000011' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000011', 89.90, 'efectivo', 'completado', 'PAGO-101', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000011', '2026-06-01 08:15:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000004' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000004', 239.90, 'yape', 'completado', 'YAPE-102', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000004', '2026-06-01 10:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000007' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000007', 239.90, 'mercadopago', 'completado', 'MP-103', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000007', '2026-06-01 12:45:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000003' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000003', 89.90, 'plin', 'completado', 'PLIN-104', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000003', '2026-06-01 14:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000005' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000005', 89.90, 'efectivo', 'completado', 'PAGO-105', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000005', '2026-06-01 16:20:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000012' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000012', 239.90, 'tarjeta_debito', 'completado', 'TD-106', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000012', '2026-06-01 18:00:00');

-- Día 2: Martes 2 Jun - 4 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000001' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000001', 89.90, 'yape', 'completado', 'YAPE-107', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000001', '2026-06-02 09:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000015' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000015', 239.90, 'efectivo', 'completado', 'PAGO-108', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000015', '2026-06-02 11:15:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000013' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000013', 89.90, 'mercadopago', 'completado', 'MP-109', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000013', '2026-06-02 15:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000016' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000016', 89.90, 'efectivo', 'completado', 'PAGO-110', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000016', '2026-06-02 17:45:00');

-- Día 3: Miércoles 3 Jun - 3 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000002' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000002', 89.90, 'plin', 'completado', 'PLIN-111', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000002', '2026-06-03 07:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000018' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000018', 239.90, 'transferencia', 'completado', 'TRF-112', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000018', '2026-06-03 12:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000014' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000014', 899.90, 'yape', 'completado', 'YAPE-113', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000014', '2026-06-03 19:00:00');

-- Día 5: Viernes 5 Jun - 5 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000006' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000006', 89.90, 'efectivo', 'completado', 'PAGO-114', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000006', '2026-06-05 08:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000019' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000019', 89.90, 'mercadopago', 'completado', 'MP-115', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000019', '2026-06-05 10:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000017' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000017', 899.90, 'tarjeta_credito', 'completado', 'TC-116', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000017', '2026-06-05 13:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000020' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000020', 899.90, 'efectivo', 'completado', 'PAGO-117', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000020', '2026-06-05 15:45:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000012' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000012', 239.90, 'yape', 'completado', 'YAPE-118', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000012', '2026-06-05 18:30:00');

-- Día 8: Lunes 8 Jun - 4 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000011' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000011', 89.90, 'plin', 'completado', 'PLIN-119', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000011', '2026-06-08 06:45:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000007' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000007', 239.90, 'yape', 'completado', 'YAPE-120', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000007', '2026-06-08 11:15:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000015' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000015', 239.90, 'efectivo', 'completado', 'PAGO-121', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000015', '2026-06-08 16:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000005' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000005', 89.90, 'tarjeta_debito', 'completado', 'TD-122', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000005', '2026-06-08 19:30:00');

-- Día 10: Miércoles 10 Jun - 3 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000013' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000013', 89.90, 'yape', 'completado', 'YAPE-123', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000013', '2026-06-10 09:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000018' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000018', 239.90, 'mercadopago', 'completado', 'MP-124', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000018', '2026-06-10 14:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000020' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000020', 899.90, 'efectivo', 'completado', 'PAGO-125', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000020', '2026-06-10 17:00:00');

-- Día 12: Viernes 12 Jun - 4 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000001' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000001', 89.90, 'efectivo', 'completado', 'PAGO-126', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000001', '2026-06-12 07:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000016' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000016', 89.90, 'yape', 'completado', 'YAPE-127', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000016', '2026-06-12 11:45:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000014' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000014', 899.90, 'transferencia', 'completado', 'TRF-128', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000014', '2026-06-12 15:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000019' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000019', 89.90, 'plin', 'completado', 'PLIN-129', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000019', '2026-06-12 20:00:00');

-- Día 15: Lunes 15 Jun - 5 pagos (día fuerte)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000003' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000003', 89.90, 'mercadopago', 'completado', 'MP-130', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000003', '2026-06-15 08:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000004' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000004', 239.90, 'efectivo', 'completado', 'PAGO-131', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000004', '2026-06-15 10:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000012' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000012', 239.90, 'yape', 'completado', 'YAPE-132', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000012', '2026-06-15 12:15:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000006' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000006', 89.90, 'tarjeta_debito', 'completado', 'TD-133', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000006', '2026-06-15 16:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000017' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000017', 899.90, 'mercadopago', 'completado', 'MP-134', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000017', '2026-06-15 18:00:00');

-- Día 18: Jueves 18 Jun - 3 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000002' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000002', 89.90, 'efectivo', 'completado', 'PAGO-135', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000002', '2026-06-18 09:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000015' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000015', 239.90, 'yape', 'completado', 'YAPE-136', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000015', '2026-06-18 13:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000011' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000011', 89.90, 'tarjeta_credito', 'completado', 'TC-137', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000011', '2026-06-18 17:00:00');

-- Día 20: Sábado 20 Jun - 5 pagos (finde semana)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000001' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000001', 89.90, 'yape', 'completado', 'YAPE-138', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000001', '2026-06-20 07:45:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000007' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000007', 239.90, 'efectivo', 'completado', 'PAGO-139', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000007', '2026-06-20 09:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000018' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000018', 239.90, 'plin', 'completado', 'PLIN-140', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000018', '2026-06-20 11:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000013' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000013', 89.90, 'mercadopago', 'completado', 'MP-141', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000013', '2026-06-20 14:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000020' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000020', 899.90, 'transferencia', 'completado', 'TRF-142', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000020', '2026-06-20 18:00:00');

-- Día 22: Lunes 22 Jun - 4 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000005' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000005', 89.90, 'yape', 'completado', 'YAPE-143', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000005', '2026-06-22 08:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000014' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000014', 899.90, 'efectivo', 'completado', 'PAGO-144', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000014', '2026-06-22 12:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000016' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000016', 89.90, 'tarjeta_debito', 'completado', 'TD-145', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000016', '2026-06-22 15:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000019' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000019', 89.90, 'efectivo', 'completado', 'PAGO-146', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000019', '2026-06-22 19:45:00');

-- Día 25: Jueves 25 Jun - 3 pagos
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000003' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000003', 89.90, 'plin', 'completado', 'PLIN-147', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000003', '2026-06-25 10:15:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000012' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000012', 239.90, 'yape', 'completado', 'YAPE-148', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000012', '2026-06-25 16:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000017' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000017', 899.90, 'mercadopago', 'completado', 'MP-149', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000017', '2026-06-25 20:00:00');

-- Día 28: Domingo 28 Jun - 2 pagos (poco movimiento)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000011' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000011', 89.90, 'efectivo', 'completado', 'PAGO-150', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000011', '2026-06-28 09:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000015' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000015', 239.90, 'tarjeta_credito', 'completado', 'TC-151', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000015', '2026-06-28 14:00:00');

-- Día 30: Martes 30 Jun - 5 pagos (cierre de mes)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por, fecha_pago)
VALUES
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000002' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000002', 89.90, 'yape', 'completado', 'YAPE-152', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000002', '2026-06-30 07:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000004' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000004', 239.90, 'efectivo', 'completado', 'PAGO-153', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000004', '2026-06-30 10:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000006' AND plan_id = 1), 'a0000000-0000-4000-8000-000000000006', 89.90, 'mercadopago', 'completado', 'MP-154', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000006', '2026-06-30 11:30:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000018' AND plan_id = 2), 'a0000000-0000-4000-8000-000000000018', 239.90, 'plin', 'completado', 'PLIN-155', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000018', '2026-06-30 15:00:00'),
  ((SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000020' AND plan_id = 3), 'a0000000-0000-4000-8000-000000000020', 899.90, 'efectivo', 'completado', 'PAGO-156', 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA', 'a0000000-0000-4000-8000-000000000020', '2026-06-30 19:00:00');

-- ============================================
-- Verificación
-- ============================================
SELECT COUNT(*) as total_pagos_generados,
       SUM(monto) as total_ingresos,
       MIN(fecha_pago) as primer_pago,
       MAX(fecha_pago) as ultimo_pago
FROM public.pagos
WHERE observaciones = 'DATOS_DE_PRUEBA_GENERADOS_POR_SYSTEMA'
  AND estado = 'completado';

-- ============================================
-- FIN DEL SEED
-- ============================================
