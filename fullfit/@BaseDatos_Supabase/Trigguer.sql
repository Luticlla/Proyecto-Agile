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