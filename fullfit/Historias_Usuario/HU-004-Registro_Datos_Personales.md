# HU-004: Registro de Datos Personales

## Historia de Usuario
**Como** Socio (nuevo usuario),
**Quiero** registrar mis datos personales de forma segura,
**Para** obtener una inscripción en el gym y acceder a los servicios de membresía.

## Estado
✅ Implementada

## Criterios de Aceptación

### 1. Formulario de Registro
- [x] Campo "Nombre" (obligatorio, input text)
- [x] Campo "Apellido" (obligatorio, input text)
- [x] Campo "DNI" (obligatorio, maxLength=8, pattern="[0-9]{8}", inputMode="numeric")
- [x] Campo "Email" (obligatorio, input email, validación con regex)
- [x] Campo "Teléfono" (opcional, input tel, prefijo +51, max 9 dígitos, empieza con 9)
- [x] Campo "Fecha de Nacimiento" (obligatorio, date picker, solo mayores de 18 años, max 100 años atrás)
- [x] Campo "Sexo" (obligatorio, select: Masculino / Femenino / Prefiero no decirlo)
- [x] Campo "Contraseña" (obligatorio, input password)
- [x] Campo "Confirmar Contraseña" (obligatorio, input password)
- [x] Botón "Crear Cuenta"

### 2. Validaciones
- [x] Contraseñas deben coincidir → error "Las contraseñas no coinciden"
- [x] Contraseña mínimo 6 caracteres → error "La contraseña debe tener al menos 6 caracteres"
- [x] DNI exactamente 8 dígitos → error "El DNI debe tener exactamente 8 dígitos"
- [x] Email válido con regex → error "El correo no es válido"
- [x] Fecha de nacimiento obligatoria → error "La fecha de nacimiento es obligatoria"
- [x] Mayor de 18 años → error "Debes ser mayor de 18 años para registrarte"
- [x] Sexo obligatorio → error "Selecciona tu sexo"
- [x] Teléfono: 9 dígitos, empieza con 9 → error "El teléfono debe tener 9 dígitos y comenzar con 9"
- [x] DNI solo acepta numerales (inputMode="numeric" + filtro en handleChange)
- [x] Teléfono solo acepta numerales (inputMode="numeric" + filtro en handleChange)
- [x] Spinner de carga "Creando cuenta..." durante envío

### 3. Envío de Datos
- [x] Se llama a `signUp()` de AuthProvider con email, password y metadata: { nombre, apellido, telefono, dni, fecha_nacimiento, genero }
- [x] Campo "Prefiero no decirlo" se envía como `null` a Supabase
- [x] Se muestra alert "¡Registro exitoso! Por favor verifica tu email para confirmar tu cuenta."
- [x] Se redirige a `/login`

### 4. Redirect si Autenticado
- [x] Si tiene sesión activa, redirige a `/` (socio) o `/recepcionista` (recepcionista/admin)

### 5. Enlaces
- [x] "¿Ya tienes cuenta? Inicia sesión aquí" → `/login`
- [x] Header tiene botón "¡Regístrate!" → `/register`
- [x] "Volver al inicio" → `/`

## Archivos Relacionados
- `app/(auth)/register/page.tsx`
- `providers/AuthProvider.tsx`
- `lib/supabase/types.ts` (Profile type con genero y fecha_nacimiento)
