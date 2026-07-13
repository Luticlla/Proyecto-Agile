-- ============================================================
-- MIGRACION: Fix recursion infinita en RLS de profiles (42P17)
-- Causa: La policy del Coach hacia subqueries directas sobre
--        suscripciones, activando su RLS que a su vez tenia
--        una subquery self-referente -> recursion infinita.
-- Solucion: Funcion SECURITY DEFINER que lee suscripciones
--           sin activar RLS, usada por ambas policies.
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Crear funcion SECURITY DEFINER para clientes del coach
--    Lee suscripciones directamente (bypass RLS) y retorna
--    los usuario_id de clientes con membresia grupal activa.
CREATE OR REPLACE FUNCTION public.get_coach_client_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT s.usuario_id
  FROM public.suscripciones s
  JOIN public.planes_membresia pm ON pm.id = s.plan_id
  WHERE s.estado = 'activa'
    AND s.fecha_fin >= CURRENT_DATE
    AND (
      pm.features @> '["Clases grupales ilimitadas"]'::jsonb
      OR pm.features @> '["Clases grupales"]'::jsonb
    );
$$;

-- Otorgar permisos de ejecucion a authenticated
GRANT EXECUTE ON FUNCTION public.get_coach_client_ids() TO authenticated;

-- 2. Reescribir la policy de profiles
--    Antes: subquery directa sobre suscripciones -> activaba RLS
--    Ahora: usa get_coach_client_ids() [SECURITY DEFINER] -> sin RLS
DROP POLICY IF EXISTS "recepcionistas_select_all_profiles" ON public.profiles;

CREATE POLICY "recepcionistas_select_all_profiles" ON public.profiles
FOR SELECT TO authenticated
USING (
  -- Admin (1) y Recepcionista (2): ven todos los perfiles
  public.get_user_role(auth.uid()) IN (1, 2)
  -- Cualquier usuario ve su propio perfil
  OR id = auth.uid()
  -- Coach (5): ve clientes (rol 3) con membresia grupal activa
  OR (
    public.get_user_role(auth.uid()) = 5
    AND rol_id = 3
    AND id IN (SELECT public.get_coach_client_ids())
  )
);

-- 3. Corregir la policy de suscripciones para el coach
--    Antes: subquery self-referente sobre suscripciones -> recursion
--    Ahora: usa get_coach_client_ids() [SECURITY DEFINER] -> sin recursion
DROP POLICY IF EXISTS "coach_select_suscripciones" ON public.suscripciones;

CREATE POLICY "coach_select_suscripciones" ON public.suscripciones
FOR SELECT TO authenticated
USING (
  public.get_user_role(auth.uid()) = 5
  AND usuario_id IN (SELECT public.get_coach_client_ids())
);

-- 4. Verificacion (opcional, ejecutar por separado):
-- SELECT policyname, tablename, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('profiles', 'suscripciones')
-- ORDER BY tablename, policyname;

-- FIN
