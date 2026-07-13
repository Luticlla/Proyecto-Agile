-- ============================================
-- Seeder: 20 Usuarios de Prueba - FullFit
-- Ejecutar en Supabase SQL Editor
-- Fecha: 2026-06-20
-- Contraseña universal: 123456789
-- ============================================

-- ============================================
-- 0. Asegurar extensión pgcrypto
-- ============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 1. Insertar planes de membresía (si no existen)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.planes_membresia WHERE nombre = 'Mensual') THEN
    INSERT INTO public.planes_membresia (nombre, descripcion, precio, duracion_dias, activo, dias_freeze_maximo)
    VALUES ('Mensual', 'Acceso completo por 30 días a todas las sedes', 89.90, 30, true, 5);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.planes_membresia WHERE nombre = 'Trimestral') THEN
    INSERT INTO public.planes_membresia (nombre, descripcion, precio, duracion_dias, activo, dias_freeze_maximo)
    VALUES ('Trimestral', 'Acceso completo por 90 días con beneficios extras', 239.90, 90, true, 30);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.planes_membresia WHERE nombre = 'Anual') THEN
    INSERT INTO public.planes_membresia (nombre, descripcion, precio, duracion_dias, activo, dias_freeze_maximo)
    VALUES ('Anual', 'Acceso completo por 365 días con todos los beneficios', 899.90, 365, true, 60);
  END IF;
END $$;

-- ============================================
-- 2. Insertar usuarios en auth.users
--    El trigger handle_new_user crea profiles automáticamente
-- ============================================

-- Variable global para el hash de contraseña
--crypt('123456789', gen_salt('bf'))

-- ------------------------------------------
-- GRUPO A: 7 usuarios con membresía por vencer (1-7 días)
-- ------------------------------------------

-- Usuario 1: Carlos García - vence 2026-06-21 (1 día)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'carlos.garcia@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Carlos", "apellido": "García", "dni": "70123456", "telefono": "951123456"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 2: María López - vence 2026-06-22 (2 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000002',
  'maria.lopez@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "María", "apellido": "López", "dni": "70234567", "telefono": "952234567"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 3: Juan Martínez - vence 2026-06-23 (3 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000003',
  'juan.martinez@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Juan", "apellido": "Martínez", "dni": "70345678", "telefono": "953345678"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 4: Ana Rodríguez - vence 2026-06-24 (4 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000004',
  'ana.rodriguez@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Ana", "apellido": "Rodríguez", "dni": "70456789", "telefono": "954456789"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 5: Luis Hernández - vence 2026-06-25 (5 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000005',
  'luis.hernandez@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Luis", "apellido": "Hernández", "dni": "70567890", "telefono": "955567890"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 6: Camila Torres - vence 2026-06-26 (6 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000006',
  'camila.torres@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Camila", "apellido": "Torres", "dni": "70678901", "telefono": "956678901"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 7: Diego Ramírez - vence 2026-06-27 (7 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000007',
  'diego.ramirez@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Diego", "apellido": "Ramírez", "dni": "70789012", "telefono": "957789012"}'::jsonb,
  now(), now(), '', ''
);

-- ------------------------------------------
-- GRUPO B: 3 usuarios con membresía vencida
-- ------------------------------------------

-- Usuario 8: Sofía Flores - venció 2026-06-05 (15 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000008',
  'sofia.flores@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Sofía", "apellido": "Flores", "dni": "70890123", "telefono": "958890123"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 9: Andrés Vargas - venció 2026-06-10 (10 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000009',
  'andres.vargas@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Andrés", "apellido": "Vargas", "dni": "70901234", "telefono": "959901234"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 10: Valeria Castillo - venció 2026-06-15 (5 días)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000010',
  'valeria.castillo@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Valeria", "apellido": "Castillo", "dni": "71012345", "telefono": "960012345"}'::jsonb,
  now(), now(), '', ''
);

-- ------------------------------------------
-- GRUPO C: 10 usuarios con membresía activa (variada)
-- ------------------------------------------

-- Usuario 11: Miguel Reyes - vence 2026-07-01 (30 días, Mensual)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000011',
  'miguel.reyes@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Miguel", "apellido": "Reyes", "dni": "71123456", "telefono": "961123456"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 12: Gabriela Morales - vence 2026-07-15 (90 días, Trimestral)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000012',
  'gabriela.morales@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Gabriela", "apellido": "Morales", "dni": "71234567", "telefono": "962234567"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 13: Fernando Ortiz - vence 2026-07-10 (30 días, Mensual)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000013',
  'fernando.ortiz@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Fernando", "apellido": "Ortiz", "dni": "71345678", "telefono": "963345678"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 14: Isabella Delgado - vence 2026-12-20 (365 días, Anual)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000014',
  'isabella.delgado@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Isabella", "apellido": "Delgado", "dni": "71456789", "telefono": "964456789"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 15: Alejandro Ruiz - vence 2026-08-01 (90 días, Trimestral)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000015',
  'alejandro.ruiz@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Alejandro", "apellido": "Ruiz", "dni": "71567890", "telefono": "965567890"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 16: Daniela Mendoza - vence 2026-07-15 (30 días, Mensual)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000016',
  'daniela.mendoza@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Daniela", "apellido": "Mendoza", "dni": "71678901", "telefono": "966678901"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 17: Roberto Aguilar - vence 2026-12-01 (365 días, Anual)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000017',
  'roberto.aguilar@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Roberto", "apellido": "Aguilar", "dni": "71789012", "telefono": "967789012"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 18: Fernanda Silva - vence 2026-07-20 (90 días, Trimestral)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000018',
  'fernanda.silva@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Fernanda", "apellido": "Silva", "dni": "71890123", "telefono": "968890123"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 19: Javier Romero - vence 2026-07-05 (30 días, Mensual)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000019',
  'javier.romero@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Javier", "apellido": "Romero", "dni": "71901234", "telefono": "969901234"}'::jsonb,
  now(), now(), '', ''
);

-- Usuario 20: Lucía Vargas - vence 2027-02-10 (365 días, Anual)
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) VALUES (
  'a0000000-0000-4000-8000-000000000020',
  'lucia.vargas@test.com',
  crypt('123456789', gen_salt('bf')),
  now(),
  '{"nombre": "Lucía", "apellido": "Vargas", "dni": "72012345", "telefono": "970012345"}'::jsonb,
  now(), now(), '', ''
);

-- ============================================
-- 3. Fallback: asegurar email en profiles
--    (el trigger ya lo copia, pero por si acaso)
-- ============================================
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;

-- ============================================
-- 4. Insertar suscripciones
-- ============================================

-- GRUPO A: 7 usuarios con membresía por vencer (1-7 días)

-- Usuario 1: Carlos García - Mensual, vence 2026-06-21
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000001', 1, '2026-05-21', '2026-06-21', 'activa', 'a0000000-0000-4000-8000-000000000001');

-- Usuario 2: María López - Mensual, vence 2026-06-22
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000002', 1, '2026-05-22', '2026-06-22', 'activa', 'a0000000-0000-4000-8000-000000000002');

-- Usuario 3: Juan Martínez - Mensual, vence 2026-06-23
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000003', 1, '2026-05-23', '2026-06-23', 'activa', 'a0000000-0000-4000-8000-000000000003');

-- Usuario 4: Ana Rodríguez - Trimestral, vence 2026-06-24
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000004', 2, '2026-03-24', '2026-06-24', 'activa', 'a0000000-0000-4000-8000-000000000004');

-- Usuario 5: Luis Hernández - Mensual, vence 2026-06-25
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000005', 1, '2026-05-25', '2026-06-25', 'activa', 'a0000000-0000-4000-8000-000000000005');

-- Usuario 6: Camila Torres - Mensual, vence 2026-06-26
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000006', 1, '2026-05-26', '2026-06-26', 'activa', 'a0000000-0000-4000-8000-000000000006');

-- Usuario 7: Diego Ramírez - Trimestral, vence 2026-06-27
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000007', 2, '2026-03-27', '2026-06-27', 'activa', 'a0000000-0000-4000-8000-000000000007');

-- GRUPO B: 3 usuarios con membresía vencida

-- Usuario 8: Sofía Flores - Mensual, venció 2026-06-05
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000008', 1, '2026-05-05', '2026-06-05', 'vencida', 'a0000000-0000-4000-8000-000000000008');

-- Usuario 9: Andrés Vargas - Mensual, venció 2026-06-10
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000009', 1, '2026-05-10', '2026-06-10', 'vencida', 'a0000000-0000-4000-8000-000000000009');

-- Usuario 10: Valeria Castillo - Trimestral, venció 2026-06-15
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000010', 2, '2026-02-15', '2026-06-15', 'vencida', 'a0000000-0000-4000-8000-000000000010');

-- GRUPO C: 10 usuarios con membresía activa

-- Usuario 11: Miguel Reyes - Mensual, vence 2026-07-01
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000011', 1, '2026-06-01', '2026-07-01', 'activa', 'a0000000-0000-4000-8000-000000000011');

-- Usuario 12: Gabriela Morales - Trimestral, vence 2026-07-15
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000012', 2, '2026-04-15', '2026-07-15', 'activa', 'a0000000-0000-4000-8000-000000000012');

-- Usuario 13: Fernando Ortiz - Mensual, vence 2026-07-10
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000013', 1, '2026-06-10', '2026-07-10', 'activa', 'a0000000-0000-4000-8000-000000000013');

-- Usuario 14: Isabella Delgado - Anual, vence 2026-12-20
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000014', 3, '2025-12-20', '2026-12-20', 'activa', 'a0000000-0000-4000-8000-000000000014');

-- Usuario 15: Alejandro Ruiz - Trimestral, vence 2026-08-01
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000015', 2, '2026-05-01', '2026-08-01', 'activa', 'a0000000-0000-4000-8000-000000000015');

-- Usuario 16: Daniela Mendoza - Mensual, vence 2026-07-15
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000016', 1, '2026-06-15', '2026-07-15', 'activa', 'a0000000-0000-4000-8000-000000000016');

-- Usuario 17: Roberto Aguilar - Anual, vence 2026-12-01
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000017', 3, '2025-12-01', '2026-12-01', 'activa', 'a0000000-0000-4000-8000-000000000017');

-- Usuario 18: Fernanda Silva - Trimestral, vence 2026-07-20
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000018', 2, '2026-04-20', '2026-07-20', 'activa', 'a0000000-0000-4000-8000-000000000018');

-- Usuario 19: Javier Romero - Mensual, vence 2026-07-05
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000019', 1, '2026-06-05', '2026-07-05', 'activa', 'a0000000-0000-4000-8000-000000000019');

-- Usuario 20: Lucía Vargas - Anual, vence 2027-02-10
INSERT INTO public.suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, creado_por)
VALUES ('a0000000-0000-4000-8000-000000000020', 3, '2026-02-10', '2027-02-10', 'activa', 'a0000000-0000-4000-8000-000000000020');

-- ============================================
-- 5. Insertar pagos
--    suscripcion_id se resuelve dinámicamente
-- ============================================

-- Grupo A: Pagos de usuarios con membresía por vencer

-- Carlos García - Pago en efectivo
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000001' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000001', 89.90, 'efectivo', 'completado', 'PAGO-001', 'Pago mensualidad mayo', 'a0000000-0000-4000-8000-000000000001'
);

-- María López - Pago con Yape
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000002' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000002', 89.90, 'yape', 'completado', 'YAPE-002', 'Pago mensualidad mayo', 'a0000000-0000-4000-8000-000000000002'
);

-- Juan Martínez - Pago con MercadoPago
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000003' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000003', 89.90, 'mercadopago', 'completado', 'MP-003', 'Pago online', 'a0000000-0000-4000-8000-000000000003'
);

-- Ana Rodríguez - Pago en efectivo (Trimestral)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000004' AND plan_id = 2),
  'a0000000-0000-4000-8000-000000000004', 239.90, 'efectivo', 'completado', 'PAGO-004', 'Pago trimestral marzo', 'a0000000-0000-4000-8000-000000000004'
);

-- Luis Hernández - Pago con Yape
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000005' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000005', 89.90, 'yape', 'completado', 'YAPE-005', 'Pago mensualidad mayo', 'a0000000-0000-4000-8000-000000000005'
);

-- Camila Torres - Pago con MercadoPago
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000006' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000006', 89.90, 'mercadopago', 'completado', 'MP-006', 'Pago online', 'a0000000-0000-4000-8000-000000000006'
);

-- Diego Ramírez - Pago en efectivo (Trimestral)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000007' AND plan_id = 2),
  'a0000000-0000-4000-8000-000000000007', 239.90, 'efectivo', 'completado', 'PAGO-007', 'Pago trimestral marzo', 'a0000000-0000-4000-8000-000000000007'
);

-- Grupo B: Pagos de usuarios con membresía vencida

-- Sofía Flores - Pago en efectivo
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000008' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000008', 89.90, 'efectivo', 'completado', 'PAGO-008', 'Pago mensualidad mayo', 'a0000000-0000-4000-8000-000000000008'
);

-- Andrés Vargas - Pago con Yape
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000009' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000009', 89.90, 'yape', 'completado', 'YAPE-009', 'Pago mensualidad mayo', 'a0000000-0000-4000-8000-000000000009'
);

-- Valeria Castillo - Pago con MercadoPago (Trimestral)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000010' AND plan_id = 2),
  'a0000000-0000-4000-8000-000000000010', 239.90, 'mercadopago', 'completado', 'MP-010', 'Pago online trimestral', 'a0000000-0000-4000-8000-000000000010'
);

-- Grupo C: Pagos de usuarios con membresía activa

-- Miguel Reyes - Pago en efectivo
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000011' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000011', 89.90, 'efectivo', 'completado', 'PAGO-011', 'Pago mensualidad junio', 'a0000000-0000-4000-8000-000000000011'
);

-- Gabriela Morales - Pago con Yape (Trimestral)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000012' AND plan_id = 2),
  'a0000000-0000-4000-8000-000000000012', 239.90, 'yape', 'completado', 'YAPE-012', 'Pago trimestral abril', 'a0000000-0000-4000-8000-000000000012'
);

-- Fernando Ortiz - Pago con MercadoPago
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000013' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000013', 89.90, 'mercadopago', 'completado', 'MP-013', 'Pago online', 'a0000000-0000-4000-8000-000000000013'
);

-- Isabella Delgado - Pago en efectivo (Anual)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000014' AND plan_id = 3),
  'a0000000-0000-4000-8000-000000000014', 899.90, 'efectivo', 'completado', 'PAGO-014', 'Pago anual diciembre', 'a0000000-0000-4000-8000-000000000014'
);

-- Alejandro Ruiz - Pago con Yape (Trimestral)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000015' AND plan_id = 2),
  'a0000000-0000-4000-8000-000000000015', 239.90, 'yape', 'completado', 'YAPE-015', 'Pago trimestral mayo', 'a0000000-0000-4000-8000-000000000015'
);

-- Daniela Mendoza - Pago con MercadoPago
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000016' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000016', 89.90, 'mercadopago', 'completado', 'MP-016', 'Pago online junio', 'a0000000-0000-4000-8000-000000000016'
);

-- Roberto Aguilar - Pago en efectivo (Anual)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000017' AND plan_id = 3),
  'a0000000-0000-4000-8000-000000000017', 899.90, 'efectivo', 'completado', 'PAGO-017', 'Pago anual diciembre', 'a0000000-0000-4000-8000-000000000017'
);

-- Fernanda Silva - Pago con Yape (Trimestral)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000018' AND plan_id = 2),
  'a0000000-0000-4000-8000-000000000018', 239.90, 'yape', 'completado', 'YAPE-018', 'Pago trimestral abril', 'a0000000-0000-4000-8000-000000000018'
);

-- Javier Romero - Pago con MercadoPago
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000019' AND plan_id = 1),
  'a0000000-0000-4000-8000-000000000019', 89.90, 'mercadopago', 'completado', 'MP-019', 'Pago online junio', 'a0000000-0000-4000-8000-000000000019'
);

-- Lucía Vargas - Pago en efectivo (Anual)
INSERT INTO public.pagos (suscripcion_id, usuario_id, monto, metodo_pago, estado, referencia, observaciones, registrado_por)
VALUES (
  (SELECT id FROM public.suscripciones WHERE usuario_id = 'a0000000-0000-4000-8000-000000000020' AND plan_id = 3),
  'a0000000-0000-4000-8000-000000000020', 899.90, 'efectivo', 'completado', 'PAGO-020', 'Pago anual febrero', 'a0000000-0000-4000-8000-000000000020'
);

-- ============================================
-- 6. Verificación
-- ============================================

-- Ver usuarios creados
SELECT p.nombre, p.apellido, p.dni, p.email, p.rol_id
FROM public.profiles p
WHERE p.dni LIKE '70%' OR p.dni LIKE '71%' OR p.dni LIKE '72%'
ORDER BY p.dni;

-- Ver membresías por estado
SELECT 
  s.estado,
  COUNT(*) as cantidad,
  MIN(s.fecha_fin) as fecha_fin_min,
  MAX(s.fecha_fin) as fecha_fin_max
FROM public.suscripciones s
JOIN public.profiles p ON p.id = s.usuario_id
WHERE p.dni LIKE '70%' OR p.dni LIKE '71%' OR p.dni LIKE '72%'
GROUP BY s.estado;

-- Ver detalle de membresías por vencer (próximos 7 días)
SELECT 
  p.nombre || ' ' || p.apellido as cliente,
  p.dni,
  pm.nombre as plan,
  s.fecha_fin,
  (s.fecha_fin - CURRENT_DATE) as dias_restantes
FROM public.suscripciones s
JOIN public.profiles p ON p.id = s.usuario_id
JOIN public.planes_membresia pm ON pm.id = s.plan_id
WHERE s.estado = 'activa'
  AND s.fecha_fin BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND (p.dni LIKE '70%' OR p.dni LIKE '71%' OR p.dni LIKE '72%')
ORDER BY s.fecha_fin;

-- ============================================
-- FIN DEL SEEDER
-- ============================================
