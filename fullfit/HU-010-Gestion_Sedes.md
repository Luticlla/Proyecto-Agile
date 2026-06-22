# HU-010: Gestión de Sedes del Gimnasio

## Historia de Usuario
**Como** Gerente,
**Quiero** registrar y administrar las sedes del gimnasio,
**Para** que la información mostrada a los socios en la web esté siempre actualizada.

## Estado
🔴 No implementada — La tabla `sedes` existe y se muestra en la web pública, pero no hay panel de administración para gestionarlas.

## Lo que YA existe

### Tabla `sedes` (BD)
- [x] Campos: id, nombre, direccion (unique), latitud, longitud, telefono, email, imagen_url, apertura_lv, cierre_lv, apertura_sab, cierre_sab, estado, creado_en, actualizado_en
- [x] Constraint: email con CHECK de formato
- [x] Constraint: dirección unique
- [x] Default estado: 'activa'
- [x] Defaults de horarios: apertura_lv=06:00, cierre_lv=22:00, apertura_sab=07:00, cierre_sab=22:00

### Página Pública de Sedes
- [x] `app/(marketing)/sedes/page.tsx` — Server component que fetch sedes activas
- [x] `components/features/sedes/SedesClient.tsx` — Cards interactivas con: imagen, nombre, dirección, teléfono, horarios expandibles, link a Google Maps
- [x] Solo muestra sedes con `estado = 'activa'`
- [x] Fetch con `createAnonServerClient()` (sin auth, datos públicos)

### Infraestructura
- [x] `next.config.ts` — Remote pattern para `dhqwfjrmrcewoixqsawh.supabase.co` (Supabase Storage)
- [x] `proxy.ts` — Protege rutas admin
- [x] Layout del recepcionista con navegación

## Lo que FALTA (No implementado)

### 1. Panel de Administración de Sedes
- [ ] No existe ruta `/recepcionista/sedes` ni `/gerente/sedes`
- [ ] No hay link en la navegación del admin hacia gestión de sedes
- [ ] No existe layout ni sección para administrar sedes

### 2. CRUD de Sedes
- [ ] **Crear sede:** No existe formulario de alta
  - [ ] No hay query `crearSede(datos)`
  - [ ] No hay componente `FormularioCrearSede`
  - [ ] No hay manejo de upload de imagen a Supabase Storage
- [ ] **Editar sede:** No existe formulario de edición
  - [ ] No hay query `obtenerSede(id)` para admin
  - [ ] No hay query `actualizarSede(id, datos)`
  - [ ] No hay componente `FormularioEditarSede`
- [ ] **Desactivar/Activar sede:** No existe lógica
  - [ ] No hay query `cambiarEstadoSede(id, estado)`
  - [ ] No hay confirmación de desactivación
  - [ ] No hay botón de activar/desactivar en la interfaz
- [ ] **Eliminar sede:** No existe (y no se recomienda — mejor desactivar)

### 3. Upload de Imagen
- [ ] No hay lógica de upload a Supabase Storage
- [ ] No hay componente `UploadImagenSede`
- [ ] No hay preview de imagen antes de subir
- [ ] No hay validación de tamaño/tipo de archivo
- [ ] No hay generación de URL pública desde Supabase Storage
- [ ] No hay eliminación de imagen anterior al actualizar

### 4. Queries de Base de Datos
- [ ] No existe `listarSedesAdmin()` que traiga todas (activas + inactivas)
- [ ] No existe `obtenerSede(id)` para admin
- [ ] No existe `crearSede(datos)` con insert
- [ ] No existe `actualizarSede(id, datos)` con update
- [ ] No existe `cambiarEstadoSede(id, estado)` para activar/desactivar
- [ ] No existe `eliminarSede(id)` (soft delete / desactivar)

### 5. API Routes
- [ ] No existe `GET /api/sedes` para admin (listar todas)
- [ ] No existe `POST /api/sedes` para crear
- [ ] No existe `PUT /api/sedes/[id]` para actualizar
- [ ] No existe `PATCH /api/sedes/[id]/estado` para activar/desactivar
- [ ] No existe `POST /api/sedes/upload` para upload de imagen

### 6. UI/Componentes
- [ ] No existe `ListaSedesAdmin.tsx` — Tabla de sedes para admin
- [ ] No existe `TarjetaSedeAdmin.tsx` — Card de sede con acciones
- [ ] No existe `FormularioSede.tsx` — Formulario de crear/editar
- [ ] No existe `UploadImagenSede.tsx` — Componente de upload
- [ ] No existe `ConfirmarDesactivarSede.tsx` — Modal de confirmación
- [ ] No existe `MapaSelector.tsx` — Selector de coordenadas (lat/lng)

### 7. Validaciones
- [ ] No hay validación de nombre unique
- [ ] No hay validación de dirección unique
- [ ] No hay validación de email format
- [ ] No hay validación de horarios (apertura < cierre)
- [ ] No hay validación de coordenadas

## Criterios de Aceptación

### 1. Acceso y Permisos
- [ ] Solo usuarios con rol de gerente (o admin) pueden acceder a `/recepcionista/sedes`
- [ ] Los recepcionistas pueden VER la lista pero NO editar (solo lectura)
- [ ] Los miembros ven la página pública `/sedes` (ya existe)

### 2. Lista de Sedes (Admin)
- [ ] Se muestra tabla con: Nombre, Dirección, Teléfono, Email, Estado (badge), Fecha creación, Acciones
- [ ] Badge de estado: Activa (verde), Inactiva (rojo)
- [ ] Filtro por estado: Todas, Activas, Inactivas
- [ ] Búsqueda por nombre o dirección
- [ ] Acciones: Ver detalle, Editar, Desactivar/Activar

### 3. Crear Sede
- [ ] Botón "Nueva Sede" abre formulario
- [ ] Campos: Nombre*, Dirección*, Teléfono*, Email*, Imagen (upload), Latitud, Longitud, Horario LV (apertura/cierre), Horario Sáb (apertura/cierre)
- [ ] Valores por defecto: apertura_lv=06:00, cierre_lv=22:00, apertura_sab=07:00, cierre_sab=22:00
- [ ] Validaciones: nombre requerido, dirección requerida y unique, teléfono requerido, email válido y unique, horarios válidos (apertura < cierre)
- [ ] Upload de imagen: máximo 5MB, formatos jpg/png/webp, preview antes de subir
- [ ] La imagen se sube a Supabase Storage y se guarda la URL pública en `imagen_url`
- [ ] Al éxito, se muestra toast y se actualiza la lista

### 4. Editar Sede
- [ ] Botón "Editar" abre formulario con datos existentes
- [ ] Todos los campos son editables
- [ ] La imagen se puede cambiar (se elimina la anterior de Storage)
- [ ] Si se quita la imagen, se establece `imagen_url = null`
- [ ] La dirección unique se valida excluyendo la sede actual
- [ ] Se muestra spinner durante actualización

### 5. Desactivar/Activar Sede
- [ ] Botón "Desactivar" (para activas) / "Activar" (para inactivas)
- [ ] Modal de confirmación: "¿Desactivar sede [Nombre]?"
- [ ] Advertencia: "Esta sede no aparecerá en la página pública para socios"
- [ ] Al confirmar, se cambia `estado = 'inactiva'`
- [ ] La sede inactiva desaparece de `/sedes` pública (ya funciona con `.eq('estado', 'activa')`)

### 6. Página Pública (ya existe, verificar)
- [x] Solo muestra sedes con `estado = 'activa'`
- [x] Muestra imagen, nombre, dirección, teléfono, horarios
- [x] Link a Google Maps con coordenadas
- [ ] **NUEVO:** Si no hay sedes activas, muestra "Próximamente" en vez de vacío

### 7. UI/UX
- [ ] Loading states con spinner
- [ ] Empty state "No hay sedes registradas"
- [ ] Mensajes de error claros en español
- [ ] Preview de imagen en formulario antes de subir
- [ ] Estilo consistente con el resto del admin

### 8. Datos de Base de Datos
- [x] Tabla `sedes` tiene todos los campos necesarios
- [x] Constraint de dirección unique
- [x] Constraint de email format
- [x] Defaults de horarios
- [ ] **NUEVO:** RLS policy para que solo admin/gerente pueda INSERT/UPDATE en `sedes`

## Archivos Relacionados

### Nuevos a crear
- `app/recepcionista/sedes/page.tsx` — Página de gestión de sedes
- `components/sedes/ListaSedesAdmin.tsx` — Tabla de sedes para admin
- `components/sedes/FormularioSede.tsx` — Formulario de crear/editar
- `components/sedes/UploadImagenSede.tsx` — Componente de upload de imagen
- `components/sedes/ConfirmarDesactivarSede.tsx` — Modal de confirmación
- `components/sedes/index.ts` — Barrel export
- `lib/supabase/queries/sedes.ts` — Queries CRUD de sedes
- `lib/supabase/queries/sedes.types.ts` — Tipos para gestión de sedes
- `app/api/sedes/route.ts` — GET (admin) + POST (crear)
- `app/api/sedes/[id]/route.ts` — PUT (actualizar) + PATCH (estado)
- `app/api/sedes/upload/route.ts` — POST (upload imagen a Supabase Storage)

### A modificar
- `proxy.ts` — Agregar ruta `/recepcionista/sedes` al matcher
- `app/recepcionista/layout.tsx` — Agregar link "Sedes" en la navegación
- `components/features/sedes/SedesClient.tsx` — Manejar caso "sin sedes activas"
- `@BaseDatos_Supabase/rls-policies/recepcionista-clientes.sql` — Agregar RLS para tabla `sedes`
- `next.config.ts` — Verificar que Supabase Storage domain está en remotePatterns (ya existe)

### Sin modificar
- `app/(marketing)/sedes/page.tsx` — Página pública (se mantiene, solo fetch de activas)
- `app/(marketing)/layout.tsx` — Layout marketing (se mantiene)
- `lib/supabase/server.ts` — Clients existentes (se reutilizan)
