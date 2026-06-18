-- ============================================
-- Migración: Agregar DNI a profiles
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Agregar columna DNI
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dni character varying(8);

-- 2. Agregar constraint de unicidad
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_dni_unique UNIQUE (dni);

-- 3. Agregar constraint de formato (8 dígitos)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_dni_check CHECK (dni ~ '^[0-9]{8}$');

-- 4. Crear índice para búsquedas por DNI
CREATE INDEX IF NOT EXISTS idx_profiles_dni ON public.profiles(dni);

-- 5. Función para obtener email por DNI (para login)
CREATE OR REPLACE FUNCTION get_email_by_dni(p_dni TEXT)
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT au.email INTO v_email
  FROM auth.users au
  INNER JOIN public.profiles p ON au.id = p.id
  WHERE p.dni = p_dni;
  
  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para crear profile automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, telefono, dni, rol_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nombre',
    NEW.raw_user_meta_data->>'apellido',
    NEW.raw_user_meta_data->>'telefono',
    NEW.raw_user_meta_data->>'dni',
    3  -- rol_id por defecto: miembro
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger para auto-crear profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================