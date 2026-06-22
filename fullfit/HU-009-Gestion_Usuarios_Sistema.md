# HU-009: Gestión de Cuentas de Usuarios del Sistema

## Historia de Usuario
**Como** Gerente,
**Quiero** crear, editar y desactivar cuentas de usuarios del sistema (recepcionistas),
**Para** que solo el personal autorizado tenga acceso a las funciones correspondientes.

## Estado
🔴 No implementada — No existe ninguna interfaz ni lógica para gestionar cuentas de personal.

## Lo que YA existe

### Estructura de Roles (BD)
- [x] Tabla `roles` con 3 registros: admin (1), recepcionista (2), miembro (3)
- [x] Tabla `profiles` con campo `rol_id` FK → `roles(id)`
- [x] Trigger `handle_new_user()` que asigna `rol_id=3` (miembro) por defecto al registrarse

### Protección de Rutas
- [x] `proxy.ts` protege `/recepcionista/*` requiriendo `rol_id === 1 || rol_id === 2`
- [x] Layout del recepcionista valida `rol_id` en client-side
- [x] Si no es recepcionista, redirige a `/`

### Infraestructura de Auth
- [x] `AuthProvider` con signUp, signIn, signOut, resetPassword, updatePassword
- [x] Login con email o DNI (RPC `get_email_by_dni`)
- [x] Registro de miembros con auto-creación de profile via trigger

## Lo que FALTA (No implementado)

### 1. Definición del Rol "Gerente"
- [ ] No existe rol "Gerente" en la tabla `roles` (solo admin=1, recepcionista=2, miembro=3)
- [ ] **Decisión necesaria:** ¿El "Gerente" es el rol admin (id=1) o se crea un nuevo rol?
- [ ] Si se crea nuevo rol, se requiere migración SQL: `INSERT INTO roles (nombre, descripcion) VALUES ('gerente', 'Gestión total del sistema')`
- [ ] `proxy.ts` debe actualizar `isRecepcionista` para incluir el nuevo rol
- [ ] El layout del recepcionista debe validar el nuevo rol

### 2. Panel de Administración de Usuarios
- [ ] No existe ruta `/recepcionista/usuarios` ni `/gerente/usuarios`
- [ ] No existe layout ni navegación para sección de gestión de usuarios
- [ ] No hay link en el header del admin hacia gestión de usuarios

### 3. CRUD de Cuentas
- [ ] **Crear cuenta:** No existe formulario para crear recepcionista/gerente
  - [ ] No hay endpoint para crear usuario con rol específico (el trigger siempre asigna rol 3)
  - [ ] No hay llamada a `supabase.auth.admin.createUser()` (requiere service role)
  - [ ] No hay formulario con: nombre, apellido, DNI, email, teléfono, contraseña, rol
- [ ] **Editar cuenta:** No existe formulario para editar datos de personal
  - [ ] No hay query `obtenerUsuarioPorId()` para personal (solo `obtenerCliente()` que filtra por rol 3)
  - [ ] No hay query `actualizarUsuario()` que permita cambiar rol
- [ ] **Desactivar cuenta:** No existe lógica para desactivar usuarios
  - [ ] No hay botón de "Desactivar" / "Activar" en la interfaz
  - [ ] No hay confirmación de desactivación
  - [ ] No hay query `desactivarUsuario(id)` que cambie `activo = false`
  - [ ] No hay lógica para impedir que un usuario se desactive a sí mismo
  - [ ] No hay lógica para impedir desactivar al último admin

### 4. Queries de Base de Datos
- [ ] No existe `listarUsuarios(filtros)` que traiga solo roles admin/recepcionista
- [ ] No existe `crearUsuario(datos)` que use service role para crear en `auth.users`
- [ ] No existe `actualizarUsuario(id, datos)` para profiles de personal
- [ ] No existe `cambiarRolUsuario(id, nuevoRol)` para cambiar entre admin/recepcionista
- [ ] No existe `desactivarUsuario(id)` / `activarUsuario(id)`
- [ ] No existe `verificarUsuarioActivo(id)` para validar antes de desactivar

### 5. API Routes
- [ ] No existe `POST /api/usuarios` para crear cuenta con service role
- [ ] No existe `PUT /api/usuarios/[id]` para actualizar datos
- [ ] No existe `PATCH /api/usuarios/[id]/rol` para cambiar rol
- [ ] No existe `PATCH /api/usuarios/[id]/estado` para activar/desactivar
- [ ] No hay validación de permisos en API (que solo gerente pueda crear/editar)

### 6. UI/Componentes
- [ ] No existe `ListaUsuarios.tsx` — Tabla de personal del sistema
- [ ] No existe `TarjetaUsuario.tsx` — Detalle de cuenta de personal
- [ ] No existe `FormularioCrearUsuario.tsx` — Formulario de alta
- [ ] No existe `FormularioEditarUsuario.tsx` — Formulario de edición
- [ ] No existe `ConfirmarDesactivacion.tsx` — Modal de confirmación
- [ ] No existe `FiltroRol.tsx` — Filtro por tipo de usuario

### 7. Seguridad
- [ ] No hay validación server-side de que solo gerente pueda gestionar usuarios
- [ ] No hay RLS policies para que solo gerente vea/modifique usuarios admin/recepcionista
- [ ] No hay registro en tabla `auditoria` al crear/editar/desactivar usuarios
- [ ] No hay validación de que no se puede desactivar a sí mismo
- [ ] No hay validación de que no se puede eliminar el último admin

## Criterios de Aceptación

### 1. Acceso y Permisos
- [ ] Solo usuarios con rol de gerente (o admin) pueden acceder a `/recepcionista/usuarios`
- [ ] Si un recepcionista intenta acceder, redirige a `/recepcionista`
- [ ] Los recepcionistas NO ven el link "Usuarios" en la navegación del admin

### 2. Lista de Usuarios
- [ ] Se muestra tabla con: Nombre, Email, DNI, Teléfono, Rol (badge), Estado (badge), Fecha creación, Acciones
- [ ] Filtro por rol: Todos, Admin, Recepcionista
- [ ] Filtro por estado: Todos, Activos, Inactivos
- [ ] Búsqueda por nombre, email o DNI
- [ ] Paginación funcional
- [ ] Badge de rol: Admin (amarillo), Recepcionista (azul), Miembro (gris) — solo se muestran admin/recepcionista
- [ ] Badge de estado: Activo (verde), Inactivo (rojo)

### 3. Crear Cuenta
- [ ] Botón "Nuevo Usuario" abre formulario
- [ ] Campos: Nombre*, Apellido*, DNI* (8 dígitos), Email*, Teléfono, Contraseña*, Rol* (select: Admin/Recepcionista)
- [ ] Validaciones: nombre requerido, apellido requerido, DNI 8 dígitos, email válido, contraseña mín 6 caracteres, rol requerido
- [ ] Se crea usuario en `auth.users` via service role + se inserta profile con rol especificado
- [ ] Se muestra spinner durante creación
- [ ] Al éxito, se muestra toast de confirmación y se actualiza la lista
- [ ] Si hay error (email duplicado, DNI duplicado), se muestra mensaje claro

### 4. Editar Cuenta
- [ ] Botón "Editar" en cada fila abre formulario con datos existentes
- [ ] Campos editables: Nombre, Apellido, DNI, Teléfono, Rol
- [ ] Email NO editable (es parte de auth.users)
- [ ] Contraseña NO editable desde aquí (usa flujo de recuperación)
- [ ] Se muestra spinner durante actualización
- [ ] Al éxito, se actualiza la fila en la tabla

### 5. Desactivar/Activar Cuenta
- [ ] Botón "Desactivar" (para activos) / "Activar" (para inactivos)
- [ ] Al hacer clic en "Desactivar", se muestra modal de confirmación:
  - [ ] Texto: "¿Estás seguro de desactivar la cuenta de [Nombre]?"
  - [ ] Advertencia: "Este usuario no podrá iniciar sesión hasta que sea reactivado"
  - [ ] Botones: "Cancelar" y "Desactivar" (rojo)
- [ ] Al confirmar, se cambia `activo = false` en `profiles`
- [ ] El usuario desactivado no puede iniciar sesión (Supabase Auth no bloquea, pero el proxy podría validar)
- [ ] Botón "Activar" reactiva la cuenta (`activo = true`)

### 6. Validaciones de Seguridad
- [ ] Un usuario no puede desactivarse a sí mismo
- [ ] Un usuario no puede cambiar su propio rol
- [ ] No se puede desactivar al último admin/gerente del sistema
- [ ] Todas las acciones se registran en `auditoria` (tabla_afectada: 'profiles', accion: 'INSERT'/'UPDATE')
- [ ] La API valida que el llamador tenga permisos de gerente

### 7. UI/UX
- [ ] Loading states con spinner durante carga de datos
- [ ] Empty state "No hay usuarios registrados" cuando la lista está vacía
- [ ] Mensajes de error claros en español
- [ ] Estilo consistente con el resto del admin (fondo zinc-950, borders zinc-800, amarillo para acentos)

## Archivos Relacionados

### Nuevos a crear
- `app/recepcionista/usuarios/page.tsx` — Página principal de gestión de usuarios
- `components/usuarios/ListaUsuarios.tsx` — Tabla de usuarios del sistema
- `components/usuarios/FormularioCrearUsuario.tsx` — Formulario de alta
- `components/usuarios/FormularioEditarUsuario.tsx` — Formulario de edición
- `components/usuarios/ConfirmarDesactivacion.tsx` — Modal de confirmación
- `components/usuarios/FiltroRol.tsx` — Filtro por rol
- `components/usuarios/index.ts` — Barrel export
- `lib/supabase/queries/usuarios.ts` — Queries CRUD de usuarios
- `lib/supabase/queries/usuarios.types.ts` — Tipos para gestión de usuarios
- `app/api/usuarios/route.ts` — POST para crear usuario (service role)
- `app/api/usuarios/[id]/route.ts` — PUT para actualizar, PATCH para estado/rol

### A modificar
- `proxy.ts` — Agregar ruta `/recepcionista/usuarios` al matcher, validar rol gerente
- `app/recepcionista/layout.tsx` — Agregar link "Usuarios" condicional (solo si rol=1/gerente)
- `lib/supabase/queries/clientes.types.ts` — Agregar tipo `UsuarioSistema`
- `@BaseDatos_Supabase/schema.sql` — Documentar rol "gerente" (o crear migración)
- `@BaseDatos_Supabase/rls-policies/recepcionista-clientes.sql` — Agregar RLS para gestión de usuarios

### Sin modificar
- `providers/AuthProvider.tsx` — No se modifica (gestión de usuarios es server-side)
- `app/(auth)/register/page.tsx` — Registro de miembros (se mantiene independiente)
