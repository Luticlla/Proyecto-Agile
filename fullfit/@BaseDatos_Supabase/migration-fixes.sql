-- ============================================
-- Migración de Correcciones - FullFit Database
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- ============================================
-- FIX 1: pagos.suscripcion_id nullable
-- Motivo: Pagos rechazados por MercadoPago no generan suscripción
-- ============================================
ALTER TABLE public.pagos
  DROP CONSTRAINT IF EXISTS pagos_suscripcion_id_fkey;

ALTER TABLE public.pagos
  ALTER COLUMN suscripcion_id DROP NOT NULL;

ALTER TABLE public.pagos
  ADD CONSTRAINT pagos_suscripcion_id_fkey
  FOREIGN KEY (suscripcion_id) REFERENCES public.suscripciones(id)
  ON DELETE SET NULL;

-- ============================================
-- FIX 2: Eliminar suscripciones.auth_user_id redundante
-- Motivo: usuario_id ya es FK a profiles → auth.users
-- ============================================
ALTER TABLE public.suscripciones
  DROP COLUMN IF EXISTS auth_user_id;

-- ============================================
-- FIX 3: CHECK constraint en sedes.email
-- Motivo: Validar formato de email en sedes
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sedes_email_check'
  ) THEN
    ALTER TABLE public.sedes
      ADD CONSTRAINT sedes_email_check
      CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- ============================================
-- FIX 4: ON DELETE behavior en Foreign Keys
-- Motivo: Evitar bloqueos al eliminar registros padre
-- ============================================

-- profiles → roles (si se elimina un rol, poner NULL)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_rol_id_fkey;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_rol_id_fkey
  FOREIGN KEY (rol_id) REFERENCES public.roles(id)
  ON DELETE SET NULL;

-- suscripciones → profiles (CASCADE: eliminar suscripciones si se elimina usuario)
ALTER TABLE public.suscripciones
  DROP CONSTRAINT IF EXISTS suscripciones_usuario_id_fkey;

ALTER TABLE public.suscripciones
  ADD CONSTRAINT suscripciones_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
  ON DELETE CASCADE;

-- suscripciones → suscripciones.creado_por (SET NULL)
ALTER TABLE public.suscripciones
  DROP CONSTRAINT IF EXISTS suscripciones_creado_por_fkey;

ALTER TABLE public.suscripciones
  ADD CONSTRAINT suscripciones_creado_por_fkey
  FOREIGN KEY (creado_por) REFERENCES public.profiles(id)
  ON DELETE SET NULL;

-- pagos → profiles.usuario_id (CASCADE)
ALTER TABLE public.pagos
  DROP CONSTRAINT IF EXISTS pagos_usuario_id_fkey;

ALTER TABLE public.pagos
  ADD CONSTRAINT pagos_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
  ON DELETE CASCADE;

-- pagos → profiles.registrado_por (SET NULL)
ALTER TABLE public.pagos
  DROP CONSTRAINT IF EXISTS pagos_registrado_por_fkey;

ALTER TABLE public.pagos
  ADD CONSTRAINT pagos_registrado_por_fkey
  FOREIGN KEY (registrado_por) REFERENCES public.profiles(id)
  ON DELETE SET NULL;

-- accesos → profiles (CASCADE)
ALTER TABLE public.accesos
  DROP CONSTRAINT IF EXISTS accesos_usuario_id_fkey;

ALTER TABLE public.accesos
  ADD CONSTRAINT accesos_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
  ON DELETE CASCADE;

-- accesos.registrado_por (SET NULL)
ALTER TABLE public.accesos
  DROP CONSTRAINT IF EXISTS accesos_registrado_por_fkey;

ALTER TABLE public.accesos
  ADD CONSTRAINT accesos_registrado_por_fkey
  FOREIGN KEY (registrado_por) REFERENCES public.profiles(id)
  ON DELETE SET NULL;

-- notificaciones → profiles (CASCADE)
ALTER TABLE public.notificaciones
  DROP CONSTRAINT IF EXISTS notificaciones_usuario_id_fkey;

ALTER TABLE public.notificaciones
  ADD CONSTRAINT notificaciones_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
  ON DELETE CASCADE;

-- auditoria → profiles (SET NULL - no perder registros de auditoría)
ALTER TABLE public.auditoria
  DROP CONSTRAINT IF EXISTS auditoria_usuario_id_fkey;

ALTER TABLE public.auditoria
  ADD CONSTRAINT auditoria_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
  ON DELETE SET NULL;

-- ============================================
-- FIX 5: Índices en Foreign Keys
-- Motivo: Postgres no indexa FKs automáticamente
-- ============================================
CREATE INDEX IF NOT EXISTS idx_suscripciones_usuario_id ON public.suscripciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_plan_id ON public.suscripciones(plan_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_creado_por ON public.suscripciones(creado_por);
CREATE INDEX IF NOT EXISTS idx_pagos_usuario_id ON public.pagos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagos_suscripcion_id ON public.pagos(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_pagos_registrado_por ON public.pagos(registrado_por);
CREATE INDEX IF NOT EXISTS idx_pagos_referencia ON public.pagos(referencia);
CREATE INDEX IF NOT EXISTS idx_accesos_usuario_id ON public.accesos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_accesos_registrado_por ON public.accesos(registrado_por);
CREATE INDEX IF NOT EXISTS idx_accesos_fecha_hora ON public.accesos(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id ON public.notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON public.notificaciones(leida);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario_id ON public.auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_tabla_afectada ON public.auditoria(tabla_afectada);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON public.auditoria(fecha);

-- ============================================
-- FIX 6: Índices para consultas frecuentes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_planes_membresia_activo ON public.planes_membresia(activo);
CREATE INDEX IF NOT EXISTS idx_sedes_estado ON public.sedes(estado);
CREATE INDEX IF NOT EXISTS idx_suscripciones_estado ON public.suscripciones(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON public.pagos(estado);

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================
