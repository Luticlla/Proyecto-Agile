# HU-006: Gestión de Membresías por Recepcionista

## Historia de Usuario
**Como** Recepcionista,
**Quiero** gestionar las membresías de los clientes (cambiar estado, registrar, renovar, suspender y generar reportes),
**Para** manejar la membresía del cliente acorde a su situación.

## Estado
⚠️ Parcialmente implementada — Solo existe estructura del recepcionista y gestión de clientes

## Lo que YA existe

### Estructura del Recepcionista
- [x] `app/recepcionista/layout.tsx` — Layout con header, navegación (Clientes, Membresías, Reportes), validación de rol (rol_id 1 o 2), botón cerrar sesión
- [x] `proxy.ts` — Middleware que protege rutas `/recepcionista/*`, redirige a `/login` si no autenticado, redirige a `/` si no es recepcionista
- [x] `app/recepcionista/page.tsx` — Dashboard con cards de Total Clientes, Membresías Activas, Membresías por Vencer (valores hardcodeados como "--"), acciones rápidas (enlaces a clientes, membresías nueva, reportes)

### Gestión de Clientes (Implementada)
- [x] `app/recepcionista/clientes/page.tsx` — Lista de clientes con búsqueda, filtro por estado de membresía (todos, activos, vencidos, sin membresía), paginación
- [x] `components/clientes/BuscadorCliente.tsx` — Búsqueda por nombre, apellido, DNI, teléfono
- [x] `components/clientes/FiltroMembresia.tsx` — Filtro por estado de suscripción
- [x] `components/clientes/ListaClientes.tsx` — Tabla con nombre, DNI, email, teléfono, estado de membresía (badge), estado activo/inactivo, acciones (ver/editar)
- [x] `components/clientes/TarjetaCliente.tsx` — Card con datos del cliente
- [x] `components/clientes/FormularioEditarCliente.tsx` — Formulario de edición
- [x] `app/recepcionista/clientes/[id]/page.tsx` — Detalle individual del cliente
- [x] `lib/supabase/queries/clientes.ts` — Queries: buscarClientes, obtenerCliente, actualizarCliente, listarClientes (con filtros), contarClientesPorEstado

### Lo que NO existe (Placeholder "Próximamente")
- `app/recepcionista/membresias/page.tsx` — Muestra "Próximamente" con lista de funcionalidades prometidas
- `app/recepcionista/reportes/page.tsx` — Muestra "Próximamente" con lista de funcionalidades prometidas
- Cambiar estado de membresía (pausar, cancelar, reactivar)
- Registrar nueva membresía desde recepcionista
- Renovar membresías
- Suspender membresías
- Generar reportes (activas/vencidas, pagos, nuevos clientes, export PDF/Excel)

## Criterios de Aceptación (Solo lo implementado)

### 1. Estructura y Acceso
- [x] El layout valida que el usuario tenga rol de recepcionista (rol_id 1 o 2)
- [x] Si no está autenticado, redirige a `/login`
- [x] Si no es recepcionista, redirige a `/`
- [x] Header muestra navegación: Clientes, Membresías, Reportes
- [x] Header muestra nombre del recepcionista y botón cerrar sesión

### 2. Dashboard
- [x] Muestra cards de Total Clientes, Membresías Activas, Membresías por Vencer
- [x] Muestra acciones rápidas: Gestionar Clientes, Nueva Membresía, Ver Reportes
- [x] Muestra sección "Membresías Próximas a Vencer" con mensaje por defecto

### 3. Gestión de Clientes
- [x] Lista clientes con tabla: nombre, DNI, email, teléfono, membresía, estado
- [x] Búsqueda por nombre, apellido, DNI, teléfono
- [x] Filtro por estado de membresía: todos, activos, vencidos, sin membresía
- [x] Paginación con botones anterior/siguiente
- [x] Badge de membresía: Activa (verde), Vencida (rojo), Sin membresía (gris)
- [x] Acciones: Ver detalle, Editar cliente
- [x] Conteo dinámico de clientes encontrados

## Archivos Relacionados
- `app/recepcionista/layout.tsx`
- `app/recepcionista/page.tsx`
- `app/recepcionista/clientes/page.tsx`
- `app/recepcionista/clientes/[id]/page.tsx`
- `app/recepcionista/membresias/page.tsx` (placeholder)
- `app/recepcionista/reportes/page.tsx` (placeholder)
- `components/clientes/` (componentes de clientes)
- `lib/supabase/queries/clientes.ts`
- `proxy.ts`
