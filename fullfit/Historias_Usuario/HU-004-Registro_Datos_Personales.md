# HU-004: Registro de Datos Personales

## Historia de Usuario
**Como** Socio (nuevo usuario),
**Quiero** registrar mis datos personales de forma segura,
**Para** obtener una inscripción en el gym y acceder a los servicios de membresía.

## Estado
⚠️ Parcialmente implementada

## Criterios de Aceptación

### 1. Formulario de Registro (Implementado)
- [x] Campo "Nombre" (obligatorio, input text)
- [x] Campo "Apellido" (obligatorio, input text)
- [x] Campo "DNI" (obligatorio, maxLength=8, pattern="[0-9]{8}")
- [x] Campo "Email" (obligatorio, input email)
- [x] Campo "Teléfono" (opcional, input tel, placeholder "+51 999 999 999")
- [x] Campo "Contraseña" (obligatorio, input password)
- [x] Campo "Confirmar Contraseña" (obligatorio, input password)
- [x] Botón "Crear Cuenta"

### 2. Validaciones (Implementadas)
- [x] Contraseñas deben coincidir → error "Las contraseñas no coinciden"
- [x] Contraseña mínimo 6 caracteres → error "La contraseña debe tener al menos 6 caracteres"
- [x] DNI exactamente 8 dígitos → error "El DNI debe tener exactamente 8 dígitos"
- [x] Spinner de carga "Creando cuenta..." durante envío

### 3. Envío de Datos (Implementado)
- [x] Se llama a `signUp()` de AuthProvider con email, password y metadata: { nombre, apellido, telefono, dni }
- [x] Se muestra alert "¡Registro exitoso! Por favor verifica tu email para confirmar tu cuenta."
- [x] Se redirige a `/login`

### 4. Redirect si Autenticado (Implementado)
- [x] Si tiene sesión activa, redirige a `/` (socio) o `/recepcionista` (recepcionista/admin)

### 5. Enlaces (Implementados)
- [x] "¿Ya tienes cuenta? Inicia sesión aquí" → `/login`
- [x] Header tiene botón "¡Regístrate!" → `/register`

---

## Campos FALTANTES (No implementados)

### Campo: Género
- **Estado BD**: La tabla `profiles` tiene campo `genero: string | null`
- **Estado Formulario**: NO existe campo de género en el formulario de registro
- **Estado AuthProvider**: `signUp()` NO envía `genero` en metadata
- **Valores esperados**: Masculino / Femenino / Otro

### Campo: Fecha de Nacimiento
- **Estado BD**: La tabla `profiles` tiene campo `fecha_nacimiento: string | null`
- **Estado Formulario**: NO existe campo de fecha de nacimiento en el formulario
- **Estado AuthProvider**: `signUp()` NO envía `fecha_nacimiento` en metadata
- **Formato esperado**: Fecha en formato ISO (YYYY-MM-DD)

### Notas Técnicas
- El formulario actual envía metadata a Supabase Auth: `{ nombre, apellido, telefono, dni }`
- El trigger de Supabase (o el AuthProvider) debería copiar estos campos a la tabla `profiles`
- Los campos faltantes requieren:
  1. Agregar inputs al formulario (select para género, date picker para fecha_nacimiento)
  2. Agregar validaciones (género obligatorio, fecha_nacimiento obligatoria)
  3. Actualizar `signUp()` en AuthProvider para incluir nuevos campos en metadata
  4. Asegurar que el trigger de BD copíe los campos a `profiles`

## Archivos Relacionados
- `app/(auth)/register/page.tsx`
- `providers/AuthProvider.tsx`
- `lib/supabase/types.ts` (Profile type con genero y fecha_nacimiento)
