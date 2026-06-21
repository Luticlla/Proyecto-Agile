# HU-006: Gestión de Membresías por Recepcionista

## Historia de Usuario
**Como** Recepcionista,
**Quiero** gestionar las membresías de los clientes (cambiar estado, registrar, renovar y suspender),
**Para** manejar la membresía del cliente acorde a su situación.

## Estado
✅ Implementada — Gestión de membresías con operaciones CRUD

## Lo que YA existe

### Estructura del Recepcionista
- [x] `app/recepcionista/layout.tsx` — Layout con header, navegación (Clientes, Membresías, Reportes), validación de rol (rol_id 1 o 2), botón cerrar sesión
- [x] `proxy.ts` — Middleware que protege rutas `/recepcionista/*`, redirige a `/login` si no autenticado, redirige a `/` si no es recepcionista
- [x] `app/recepcionista/page.tsx` — Dashboard con cards de Total Clientes, Membresías Activas, Membresías por Vencer

### Gestión de Clientes (Implementada)
- [x] `app/recepcionista/clientes/page.tsx` — Lista de clientes con búsqueda, filtro por estado de membresía, paginación
- [x] `components/clientes/BuscadorCliente.tsx` — Búsqueda por nombre, apellido, DNI, teléfono
- [x] `components/clientes/FiltroMembresia.tsx` — Filtro por estado de suscripción
- [x] `components/clientes/ListaClientes.tsx` — Tabla con nombre, DNI, email, teléfono, estado de membresía, estado activo/inactivo, acciones
- [x] `components/clientes/TarjetaCliente.tsx` — Card con datos del cliente
- [x] `components/clientes/FormularioEditarCliente.tsx` — Formulario de edición
- [x] `app/recepcionista/clientes/[id]/page.tsx` — Detalle individual del cliente con sección para registrar membresía
- [x] `lib/supabase/queries/clientes.ts` — Queries: buscarClientes, obtenerCliente, actualizarCliente, listarClientes

### Gestión de Membresías (Implementada)
- [x] `app/recepcionista/membresias/page.tsx` — Página principal con tabla de membresías, filtros y paginación
- [x] `components/membresias/ListaMembresias.tsx` — Tabla detallada con columnas: Cliente, DNI, Plan, Estado, Inicio, Vencimiento, Días restantes, Acciones
- [x] `components/membresias/BadgeEstado.tsx` — Badge con color según estado (activa, vencida, cancelada, suspendida)
- [x] `components/membresias/BadgeDiasRestantes.tsx` — Badge con color según días restantes
- [x] `components/membresias/ConfirmarAccion.tsx` — Modal de confirmación para acciones
- [x] `components/membresias/FormularioRegistrarMembresia.tsx` — Formulario para registrar nueva membresía

### API Routes (Implementadas)
- [x] `app/api/membresias/route.ts` — GET (listar) + POST (registrar nueva membresía)
- [x] `app/api/membresias/[id]/route.ts` — PATCH (cambiar estado: cancelar, pausar, reactivar)
- [x] `app/api/membresias/[id]/renovar/route.ts` — POST (renovar membresía)
- [x] `app/api/planes/route.ts` — GET (listar planes activos)

### Base de Datos
- [x] `lib/supabase/queries/membresias.ts` — Queries completas de membresías
- [x] `lib/supabase/queries/membresias.types.ts` — Tipos TypeScript para membresías
- [x] Migración SQL ejecutada — Políticas RLS restrictivas para suscripciones y pagos

### Utilidades
- [x] `lib/utils/boleta.ts` — Generación de boleta PDF para pagos en efectivo

## Criterios de Aceptación

### 1. Estructura y Acceso
- [x] El layout valida que el usuario tenga rol de recepcionista (rol_id 1 o 2)
- [x] Si no está autenticado, redirige a `/login`
- [x] Si no es recepcionista, redirige a `/`
- [x] Header muestra navegación: Clientes, Membresías, Reportes
- [x] Header muestra nombre del recepcionista y botón cerrar sesión

### 2. Dashboard
- [x] Muestra cards de Total Clientes, Membresías Activas, Membresías por Vencer
- [x] Muestra widget de búsqueda rápida de miembros (BusquedaRapida)

### 3. Gestión de Clientes
- [x] Lista clientes con tabla: nombre, DNI, email, teléfono, membresía, estado
- [x] Búsqueda por nombre, apellido, DNI, teléfono
- [x] Filtro por estado de membresía: todos, activos, vencidos, sin membresía
- [x] Paginación con botones anterior/siguiente
- [x] Badge de membresía: Activa (verde), Vencida (rojo), Sin membresía (gris)
- [x] Acciones: Ver detalle, Editar cliente

### 4. Gestión de Membresías
- [x] Tabla de membresías con columnas: Cliente, DNI, Plan, Estado, Inicio, Vencimiento, Días restantes, Acciones
- [x] Búsqueda por nombre o DNI del cliente
- [x] Filtro por estado en backend (API soporta parámetro `estado`: Todas, Activas, Vencidas, Canceladas, Suspendidas)
- [x] Paginación con selector de 10, 25, 50 elementos
- [x] Badges de estado con colores diferenciados
- [x] Badges de días restantes con colores según urgencia

### 5. Registrar Nueva Membresía
- [x] Botón "Registrar Membresía" en detalle del cliente
- [x] Formulario con selección de plan (lista de planes activos)
- [x] Selección de método de pago: Efectivo o MercadoPago
- [x] Resumen antes de confirmar (monto total, vigencia)
- [x] Generación automática de boleta PDF si es pago en efectivo
- [x] Redirección a MercadoPago si se elige ese método

### 6. Cambiar Estado de Membresía
- [x] Cancelar membresía activa
- [x] Pausar membresía activa (suspendida)
- [x] Reactivar membresía pausada o cancelada
- [x] Modal de confirmación para cada acción
- [x] Validación de transiciones permitidas

### 7. Renovar Membresía
- [x] Botón "Renovar" solo aparece si la membresía vence en ≤ 7 días
- [x] Extensión automática de la fecha de vencimiento
- [x] Selección de nuevo plan y método de pago
- [x] Generación de boleta si es efectivo

### 8. Boleta PDF
- [x] Datos completos del gimnasio (nombre, dirección, RUC)
- [x] Datos del cliente (nombre, DNI)
- [x] Detalle del plan y monto
- [x] Número de boleta secuencial
- [x] Opción de descargar el PDF

### 9. Seguridad
- [x] Autenticación requerida en todas las API routes
- [x] Validación de rol de recepcionista (rol_id 1 o 2)
- [x] Políticas RLS en Supabase para suscripciones y pagos
- [x] Registro de auditoría para acciones importantes

## Archivos Relacionados

### Archivos existentes (modificados)
- `app/recepcionista/membresias/page.tsx` — Reemplazado placeholder con implementación completa
- `app/recepcionista/clientes/[id]/page.tsx` — Agregada sección para registrar membresía

### Archivos nuevos creados
- `lib/supabase/queries/membresias.ts` — Queries de membresías
- `lib/supabase/queries/membresias.types.ts` — Tipos TypeScript
- `lib/utils/boleta.ts` — Generación de boleta PDF
- `components/membresias/BadgeEstado.tsx` — Badge de estado
- `components/membresias/BadgeDiasRestantes.tsx` — Badge de días restantes
- `components/membresias/ConfirmarAccion.tsx` — Modal de confirmación
- `components/membresias/ListaMembresias.tsx` — Tabla de membresías
- `components/membresias/FormularioRegistrarMembresia.tsx` — Formulario de registro
- `components/membresias/index.ts` — Barrel export
- `app/api/membresias/route.ts` — API GET/POST membresías
- `app/api/membresias/[id]/route.ts` — API PATCH cambiar estado
- `app/api/membresias/[id]/renovar/route.ts` — API POST renovar
- `app/api/planes/route.ts` — API GET listar planes
- `@BaseDatos_Supabase/rls-policies/recepcionista-clientes.sql` — Políticas RLS para suscripciones y pagos

### Sin modificar
- `app/recepcionista/layout.tsx` — Layout existente
- `app/recepcionista/page.tsx` — Dashboard existente
- `components/clientes/` — Todos los componentes de clientes
- `lib/supabase/queries/clientes.ts` — Queries existentes
- `proxy.ts` — Middleware existente
