-- ============================================
-- Migración: Agregar email a profiles
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Agregar columna email
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email character varying(255);

-- 2. Agregar constraint de unicidad
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- 3. Crear índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 4. Backfill: copiar emails de auth.users a profiles
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;

-- 5. Actualizar trigger para incluir email, fecha_nacimiento y genero
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, rol_id, nombre, apellido, telefono, fecha_nacimiento, genero, activo, creado_en, actualizado_en, dni, email)
  VALUES (
    NEW.id,
    3,
    NEW.raw_user_meta_data->>'nombre',
    NEW.raw_user_meta_data->>'apellido',
    NEW.raw_user_meta_data->>'telefono',
    CASE WHEN NEW.raw_user_meta_data->>'fecha_nacimiento' = '' THEN NULL
         ELSE (NEW.raw_user_meta_data->>'fecha_nacimiento')::date END,
    CASE WHEN NEW.raw_user_meta_data->>'genero' = '' THEN NULL
         ELSE NEW.raw_user_meta_data->>'genero' END,
    true,
    NOW(),
    NOW(),
    NEW.raw_user_meta_data->>'dni',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================