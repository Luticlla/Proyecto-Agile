-- 1. Crear tabla de clases
CREATE TABLE public.clases_grupales (
  id serial PRIMARY KEY,
  nombre character varying NOT NULL,
  descripcion text,
  entrenador character varying,
  capacidad integer,
  color_hex character varying DEFAULT '#facc15',
  activa boolean DEFAULT true,
  creado_en timestamp without time zone DEFAULT now()
);

-- 2. Crear tabla de horarios recurrentes para las clases
CREATE TABLE public.horarios_clases (
  id serial PRIMARY KEY,
  clase_id integer NOT NULL REFERENCES public.clases_grupales(id) ON DELETE CASCADE,
  dia_semana integer NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=Domingo, 1=Lunes... 6=Sábado
  hora_inicio time without time zone NOT NULL,
  hora_fin time without time zone NOT NULL,
  UNIQUE(clase_id, dia_semana, hora_inicio)
);

-- Habilitar RLS (opcional si es interno, pero recomendado)
ALTER TABLE public.clases_grupales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_clases ENABLE ROW LEVEL SECURITY;

-- Políticas temporales para lectura pública y escritura por gerentes/recepcionistas (rol 1 y 2)
CREATE POLICY "Lectura pública de clases" ON public.clases_grupales FOR SELECT USING (true);
CREATE POLICY "Lectura pública de horarios" ON public.horarios_clases FOR SELECT USING (true);

-- Asumiendo que se maneja la seguridad en la API, o si se necesitan políticas completas:
CREATE POLICY "Modificación de clases staff" ON public.clases_grupales FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE rol_id IN (1, 2))
);
CREATE POLICY "Modificación de horarios staff" ON public.horarios_clases FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE rol_id IN (1, 2))
);

-- 3. Migración de Datos Actuales (Funcional y Gap)
INSERT INTO public.clases_grupales (id, nombre, color_hex) VALUES 
(1, 'Funcional', '#ef4444'),
(2, 'Gap', '#3b82f6');

-- Ajustar la secuencia de ID de clases_grupales si insertamos manualmente
SELECT setval('clases_grupales_id_seq', (SELECT MAX(id) FROM public.clases_grupales));

-- Insertar sus horarios de Lunes a Viernes (1 al 5) usando los horarios que ya estaban en "sedes"
-- (Suponemos que hay al menos 1 sede activa)
DO $$
DECLARE
  v_funcional_inicio time;
  v_funcional_fin time;
  v_gap_inicio time;
  v_gap_fin time;
BEGIN
  SELECT clase_funcional_inicio, clase_funcional_fin, clase_gap_inicio, clase_gap_fin
  INTO v_funcional_inicio, v_funcional_fin, v_gap_inicio, v_gap_fin
  FROM public.sedes LIMIT 1;

  -- Si existían los horarios, migrarlos:
  IF v_funcional_inicio IS NOT NULL THEN
    FOR d IN 1..5 LOOP
      INSERT INTO public.horarios_clases (clase_id, dia_semana, hora_inicio, hora_fin)
      VALUES (1, d, v_funcional_inicio, v_funcional_fin);
    END LOOP;
  END IF;

  IF v_gap_inicio IS NOT NULL THEN
    FOR d IN 1..5 LOOP
      INSERT INTO public.horarios_clases (clase_id, dia_semana, hora_inicio, hora_fin)
      VALUES (2, d, v_gap_inicio, v_gap_fin);
    END LOOP;
  END IF;
END $$;

-- 4. Limpieza de la tabla sedes
ALTER TABLE public.sedes
  DROP COLUMN IF EXISTS clase_funcional_inicio,
  DROP COLUMN IF EXISTS clase_funcional_fin,
  DROP COLUMN IF EXISTS clase_gap_inicio,
  DROP COLUMN IF EXISTS clase_gap_fin;
