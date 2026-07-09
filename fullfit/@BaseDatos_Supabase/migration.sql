-- ============================================
-- Migración: Asignar recepcionistas y admins a una sede
-- Fecha: 2026-07-08
-- Sede objetivo: id=1 "Sede Principal"
-- VERSIÓN CORREGIDA (ver notas al final de cada bloque)
-- ============================================

-- ============================================
-- 1. AGREGAR sede_id A PROFILES (nullable temporalmente)
-- ============================================

ALTER TABLE public.profiles 
ADD COLUMN sede_id INTEGER REFERENCES public.sedes(id) ON DELETE RESTRICT;

CREATE INDEX idx_profiles_sede_id ON public.profiles(sede_id);

-- ============================================
-- 2. ASIGNAR SEDE EXISTENTE A STAFF ACTUAL
-- ============================================

UPDATE public.profiles 
SET sede_id = 1 
WHERE rol_id IN (1, 2);

-- ============================================
-- 3. AGREGAR CONSTRAINT NOT NULL PARA ROL 1 Y 2
-- ============================================

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_sede_id_roles_check 
CHECK (
  (rol_id IN (1, 2) AND sede_id IS NOT NULL) OR
  (rol_id = 3 AND sede_id IS NULL)
);

COMMENT ON COLUMN public.profiles.sede_id IS 'Sede asignada. Obligatorio para admin (1) y recepcionista (2). NULL para miembros (3).';


-- ============================================
-- 4. AGREGAR sede_id A TABLAS TRANSACCIONALES
-- ============================================

ALTER TABLE public.suscripciones 
ADD COLUMN sede_id INTEGER REFERENCES public.sedes(id) ON DELETE SET NULL;

CREATE INDEX idx_suscripciones_sede_id ON public.suscripciones(sede_id);

ALTER TABLE public.pagos 
ADD COLUMN sede_id INTEGER REFERENCES public.sedes(id) ON DELETE SET NULL;

CREATE INDEX idx_pagos_sede_id ON public.pagos(sede_id);

ALTER TABLE public.accesos 
ADD COLUMN sede_id INTEGER REFERENCES public.sedes(id) ON DELETE SET NULL;

CREATE INDEX idx_accesos_sede_id ON public.accesos(sede_id);


-- ============================================
-- 5. BACKFILL: Asignar sede_id = 1 a registros históricos
-- ============================================

UPDATE public.suscripciones s
SET sede_id = (
  SELECT p.sede_id FROM public.profiles p WHERE p.id = s.creado_por
)
WHERE sede_id IS NULL;

UPDATE public.pagos p
SET sede_id = (
  SELECT pr.sede_id FROM public.profiles pr WHERE pr.id = p.registrado_por
)
WHERE sede_id IS NULL;

UPDATE public.accesos a
SET sede_id = (
  SELECT pr.sede_id FROM public.profiles pr WHERE pr.id = a.registrado_por
)
WHERE sede_id IS NULL AND registrado_por IS NOT NULL;


-- ============================================
-- 6. FUNCIONES HELPER PARA RLS
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_sede_id(user_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT sede_id FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_sede_id(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT rol_id FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;


-- ============================================
-- 7. HABILITAR RLS Y POLÍTICAS
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;
-- FIX: también protegemos notificaciones y auditoria, que antes quedaban sin RLS
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_select_all_profiles" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_update_all_profiles" ON profiles;
DROP POLICY IF EXISTS "recepcionistas_select_suscripciones" ON suscripciones;
DROP POLICY IF EXISTS "recepcionistas_insert_suscripciones" ON suscripciones;
DROP POLICY IF EXISTS "recepcionistas_update_suscripciones" ON suscripciones;
DROP POLICY IF EXISTS "recepcionistas_select_pagos" ON pagos;
DROP POLICY IF EXISTS "recepcionistas_insert_pagos" ON pagos;
DROP POLICY IF EXISTS "recepcionistas_select_accesos" ON accesos;
DROP POLICY IF EXISTS "recepcionistas_insert_accesos" ON accesos;

-- Profiles
CREATE POLICY "users_select_own_profile" ON profiles
FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "users_update_own_profile" ON profiles
FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "staff_select_sede_profiles" ON profiles
FOR SELECT TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2) AND (
    (rol_id = 3 AND sede_id = public.get_user_sede_id(auth.uid()))
    OR (rol_id IN (1, 2) AND sede_id = public.get_user_sede_id(auth.uid()))
    OR id = auth.uid()
  )
);

CREATE POLICY "staff_update_sede_profiles" ON profiles
FOR UPDATE TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2) AND (
    (rol_id = 3 AND sede_id = public.get_user_sede_id(auth.uid()))
    OR (rol_id IN (1, 2) AND sede_id = public.get_user_sede_id(auth.uid()))
    OR id = auth.uid()
  )
)
WITH CHECK (
  public.get_user_role(auth.uid()) IN (1, 2) AND (
    (rol_id = 3 AND sede_id = public.get_user_sede_id(auth.uid()))
    OR (rol_id IN (1, 2) AND sede_id = public.get_user_sede_id(auth.uid()))
    OR id = auth.uid()
  )
);

-- Suscripciones
CREATE POLICY "staff_suscripciones_sede" ON suscripciones
FOR ALL TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2) AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = suscripciones.usuario_id 
    AND p.sede_id = public.get_user_sede_id(auth.uid())
  )
)
WITH CHECK (
  public.get_user_role(auth.uid()) IN (1, 2) AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = suscripciones.usuario_id 
    AND p.sede_id = public.get_user_sede_id(auth.uid())
  )
);

CREATE POLICY "miembro_own_suscripciones" ON suscripciones
FOR SELECT TO authenticated
USING (public.get_user_role(auth.uid()) = 3 AND usuario_id = auth.uid());

-- Pagos
CREATE POLICY "staff_pagos_sede" ON pagos
FOR ALL TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2) AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = pagos.usuario_id 
    AND p.sede_id = public.get_user_sede_id(auth.uid())
  )
)
WITH CHECK (
  public.get_user_role(auth.uid()) IN (1, 2) AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = pagos.usuario_id 
    AND p.sede_id = public.get_user_sede_id(auth.uid())
  )
);

CREATE POLICY "miembro_own_pagos" ON pagos
FOR SELECT TO authenticated
USING (public.get_user_role(auth.uid()) = 3 AND usuario_id = auth.uid());

-- Accesos
-- FIX DE SEGURIDAD: antes el "OR registrado_por = auth.uid()" aplicaba también al
-- INSERT/UPDATE/DELETE (porque la policy es FOR ALL), permitiendo que un recepcionista
-- registrara accesos de miembros de OTRA sede con solo ponerse a sí mismo como
-- registrado_por. Separamos USING (lectura/registro histórico, más permisivo) de
-- WITH CHECK (escritura, exige siempre que el miembro pertenezca a la sede del staff).
CREATE POLICY "staff_accesos_sede" ON accesos
FOR ALL TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2) AND (
    registrado_por = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = accesos.usuario_id 
      AND p.sede_id = public.get_user_sede_id(auth.uid())
    )
  )
)
WITH CHECK (
  public.get_user_role(auth.uid()) IN (1, 2) AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = accesos.usuario_id 
    AND p.sede_id = public.get_user_sede_id(auth.uid())
  )
);

CREATE POLICY "miembro_own_accesos" ON accesos
FOR SELECT TO authenticated
USING (public.get_user_role(auth.uid()) = 3 AND usuario_id = auth.uid());

-- Sedes
CREATE POLICY "staff_select_own_sede" ON sedes
FOR SELECT TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2) AND id = public.get_user_sede_id(auth.uid())
);

-- FIX: los miembros (rol 3) no tenían ninguna policy de lectura sobre sedes.
-- Sin esto, un miembro no puede ver la dirección/horario/teléfono de su propia sede.
CREATE POLICY "miembro_select_own_sede" ON sedes
FOR SELECT TO authenticated
USING (
  public.get_user_role(auth.uid()) = 3
  AND id = (SELECT s.sede_id FROM public.suscripciones s WHERE s.usuario_id = auth.uid() LIMIT 1)
);

CREATE POLICY "admin_manage_sedes" ON sedes
FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 1)
WITH CHECK (public.get_user_role(auth.uid()) = 1);

-- Notificaciones (antes sin RLS: cualquier usuario autenticado podía leer/escribir
-- notificaciones de otros usuarios vía API)
CREATE POLICY "users_select_own_notificaciones" ON notificaciones
FOR SELECT TO authenticated
USING (usuario_id = auth.uid());

CREATE POLICY "users_update_own_notificaciones" ON notificaciones
FOR UPDATE TO authenticated
USING (usuario_id = auth.uid())
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "staff_manage_sede_notificaciones" ON notificaciones
FOR ALL TO authenticated
USING (
  public.get_user_role(auth.uid()) IN (1, 2) AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = notificaciones.usuario_id
    AND p.sede_id = public.get_user_sede_id(auth.uid())
  )
)
WITH CHECK (
  public.get_user_role(auth.uid()) IN (1, 2) AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = notificaciones.usuario_id
    AND p.sede_id = public.get_user_sede_id(auth.uid())
  )
);

-- Auditoria (antes sin RLS: log sensible expuesto por completo vía API)
-- Solo admins pueden leer auditoría. No se permite INSERT/UPDATE/DELETE vía policy
-- de usuario: se asume que estos registros se generan solo desde funciones
-- SECURITY DEFINER o triggers del backend.
CREATE POLICY "admin_select_auditoria" ON auditoria
FOR SELECT TO authenticated
USING (public.get_user_role(auth.uid()) = 1);


-- ============================================
-- 8. TRIGGERS AUTO-ASIGNACIÓN
-- ============================================

CREATE OR REPLACE FUNCTION public.set_sede_from_creator()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN NEW.sede_id := (SELECT sede_id FROM public.profiles WHERE id = NEW.creado_por); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trigger_set_sede_suscripciones ON public.suscripciones;
CREATE TRIGGER trigger_set_sede_suscripciones BEFORE INSERT ON public.suscripciones
FOR EACH ROW EXECUTE FUNCTION public.set_sede_from_creator();

CREATE OR REPLACE FUNCTION public.set_sede_from_registrado_por()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN NEW.sede_id := (SELECT sede_id FROM public.profiles WHERE id = NEW.registrado_por); RETURN NEW; END; $$;

-- FIX CRÍTICO: pagos NO tiene columna "creado_por", solo "registrado_por".
-- El trigger original usaba set_sede_from_creator() (que referencia NEW.creado_por),
-- lo que provocaba el error "record new has no field creado_por" en cada INSERT
-- sobre pagos. Se corrige usando la función correcta.
DROP TRIGGER IF EXISTS trigger_set_sede_pagos ON public.pagos;
CREATE TRIGGER trigger_set_sede_pagos BEFORE INSERT ON public.pagos
FOR EACH ROW EXECUTE FUNCTION public.set_sede_from_registrado_por();

DROP TRIGGER IF EXISTS trigger_set_sede_accesos ON public.accesos;
CREATE TRIGGER trigger_set_sede_accesos BEFORE INSERT ON public.accesos
FOR EACH ROW EXECUTE FUNCTION public.set_sede_from_registrado_por();


-- ============================================
-- FIN
-- ============================================