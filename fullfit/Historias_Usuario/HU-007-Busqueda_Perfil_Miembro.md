# HU-007: Búsqueda Rápida de Perfil de Miembro

## Historia de Usuario
**Como** Recepcionista,
**Quiero** buscar rápidamente el perfil de un miembro con sus datos y estado de membresía,
**Para** responder consultas y resolver incidencias en el acto.

## Estado
✅ Implementada — Búsqueda, perfil con membresía, historial de pagos, búsqueda rápida en dashboard e indicadores de urgencia

## Lo que YA existe

### Búsqueda y Listado
- [x] `BuscadorCliente` — Búsqueda por nombre, DNI o teléfono con input limpiable
- [x] `FiltroMembresia` — Filtro por estado: todos, activos, vencidos, sin membresía
- [x] `ListaClientes` — Tabla con columnas: Nombre, DNI, Email, Teléfono, Membresía (badge), Estado (badge), Acciones (ver/editar)
- [x] `listarClientes()` — Query con paginación, filtros por estado de suscripción, enriquecimiento con datos de membresía
- [x] `buscarClientes()` — Búsqueda rápida con límite de 20 resultados
- [x] Paginación con botones anterior/siguiente y conteo de resultados
- [x] Badges de membresía: Activa (verde), Vencida (rojo), Sin membresía (gris)
- [x] Badges de estado: Activo (verde), Inactivo (gris)

### Detalle del Cliente
- [x] `obtenerCliente(id)` — Query para obtener un cliente por ID
- [x] `TarjetaCliente` — Card con datos del perfil: nombre, DNI, email, teléfono, género, fecha de nacimiento, estado activo/inactivo
- [x] `FormularioEditarCliente` — Formulario de edición con validaciones (nombre, apellido, DNI 8 dígitos)
- [x] Ruta `/recepcionista/clientes/[id]` — Página de detalle con modo vista y modo edición
- [x] Botón de regreso a la lista
- [x] Indicador de carga (Loader2 spinner)
- [x] Estado de "Cliente no encontrado"

### Infraestructura
- [x] `proxy.ts` — Middleware que protege `/recepcionista/*` requiriendo rol 1 o 2
- [x] Layout del recepcionista con navegación (Clientes, Membresías, Reportes)
- [x] Header con nombre del recepcionista y botón cerrar sesión

## Lo que FALTA (No implementado)

### 1. Sección de Membresía en el Detalle del Cliente
- [x] `SeccionMembresia` — Componente con datos de membresía del cliente
- [x] Query `obtenerClienteConMembresia(id)` con JOIN a `suscripciones` y `planes_membresia`
- [x] La página `/recepcionista/clientes/[id]` muestra:
  - [x] Nombre del plan activo
  - [x] Fecha de inicio de la suscripción
  - [x] Fecha de vencimiento de la suscripción
  - [x] Estado de la suscripción (activa, vencida, cancelada, suspendida)
  - [x] Días restantes hasta el vencimiento
  - [x] Historial de pagos recientes (últimos 5)

### 2. Búsqueda Rápida desde el Dashboard
- [x] Widget de búsqueda en el dashboard del recepcionista (`BusquedaRapida`)
- [x] Componente `BusquedaRapida` con debounce 300ms
- [x] API route `/api/buscar-clientes` para sugerencias

### 3. Indicadores Visuales de Urgencia
- [x] Badge amarillo "Vence en X días" para membresías por vencer (≤7 días)
- [x] Badge rojo "Venció hoy" para membresías vencidas el día actual
- [x] Badge "Vence en X días" en la tabla de clientes

### 4. Métricas del Dashboard
- [x] Cards del dashboard muestran datos reales via `/api/dashboard`
- [x] Conteo real de membresías activas y por vencer

## Criterios de Aceptación

### 1. Búsqueda en la Lista de Clientes
- [x] El recepcionista puede escribir nombre, DNI o teléfono en el campo de búsqueda
- [x] La búsqueda se ejecuta al escribir (onSearch inmediato)
- [x] Se muestra un botón "×" para limpiar la búsqueda
- [x] Los resultados se actualizan en la tabla con badges de membresía y estado
- [x] Se muestra el conteo de clientes encontrados ("X cliente(s) encontrado(s)")
- [x] La paginación funciona correctamente (anterior/siguiente)
- [x] El filtro de membresía se puede combinar con la búsqueda

### 2. Filtro por Estado de Membresía
- [x] Dropdown con opciones: Todos, Con membresía activa, Membresía vencida, Sin membresía
- [x] Al cambiar el filtro, se resetea la búsqueda y se carga la página 1
- [x] El filtro afecta el conteo de resultados
- [x] Badge de membresía: "Activa" (verde), "Vencida" (rojo con fecha), "Sin membresía" (gris)

### 3. Detalle del Cliente
- [x] Al hacer clic en "Ver" (ícono ojo), se navega a `/recepcionista/clientes/{id}`
- [x] Se muestra la tarjeta del cliente con TODOS los datos del perfil
- [x] Se muestra una sección "Membresía" con:
  - [x] Nombre del plan (Mensual, Trimestral, Anual)
  - [x] Estado de la suscripción (badge: activa/vencida/cancelada/suspendida)
  - [x] Fecha de inicio (formato DD/MM/YYYY)
  - [x] Fecha de vencimiento (formato DD/MM/YYYY)
  - [x] Días restantes (con color: verde >30, amarillo 7-30, rojo <7)
  - [x] Si no tiene membresía, mostrar "Sin membresía activa"
- [x] Se muestra una sección "Historial de Pagos" con los últimos 5 pagos:
  - [x] Fecha del pago
  - [x] Monto (formato S/ XX.XX)
  - [x] Método de pago (efectivo, mercadopago, etc.)
  - [x] Estado del pago (completado, pendiente, fallido)

### 4. Búsqueda Rápida desde Dashboard
- [x] Widget de búsqueda en el dashboard del recepcionista
- [x] Input de búsqueda con ícono de lupa
- [x] Al escribir, se muestran sugerencias en tiempo real (máximo 5 resultados)
- [x] Cada sugerencia muestra: nombre completo, DNI, estado de membresía
- [x] Al hacer clic en una sugerencia, se navega al detalle del cliente
- [x] Si no hay resultados, se muestra "No se encontraron miembros"

### 5. Indicadores Visuales
- [x] En la lista de clientes, membresías por vencer (≤7 días) muestran badge amarillo con "Vence en X días"
- [x] Membresías vencidas hoy muestran badge rojo con "Venció hoy"

### 6. Datos de Base de Datos
- [x] Tabla `profiles` tiene todos los campos necesarios (nombre, apellido, dni, email, telefono, fecha_nacimiento, genero, activo)
- [x] Tabla `suscripciones` tiene: usuario_id, plan_id, fecha_inicio, fecha_fin, estado
- [x] Tabla `planes_membresia` tiene: id, nombre, precio, duracion_dias
- [x] Query `obtenerClienteConMembresia(id)` que haga JOIN de profiles + suscripciones + planes_membresia
- [x] Query `obtenerHistorialPagos(usuarioId, limit)` que traiga los últimos N pagos

### 7. Validaciones y Casos de Borde
- [x] Si el DNI tiene caracteres no numéricos, la búsqueda los ignora
- [x] Si el campo de búsqueda está vacío, se muestran todos los clientes
- [x] Si no hay clientes que coincidan, se muestra "No se encontraron clientes"
- [x] Si el cliente no existe al acceder al detalle, se muestra "Cliente no encontrado" con enlace a volver
- [x] Si el cliente no tiene suscripciones, la sección de membresía muestra "Sin membresía activa" (no error)
- [x] Si el cliente tiene múltiples suscripciones, se muestra la más reciente
- [x] La búsqueda rápida del dashboard tiene debounce de 300ms para evitar spam de queries

### 8. UI/UX
- [x] Loading states con Loader2 spinner durante carga de datos
- [x] Mensajes de error claros y en español
- [x] Botón de regreso a la lista desde el detalle
- [x] Modo edición con botón "Editar" y toggle a formulario

## Archivos Relacionados

### Modificados
- `app/recepcionista/page.tsx` — Widget de búsqueda rápida (BusquedaRapida)
- `app/recepcionista/clientes/[id]/page.tsx` — Sección de membresía e historial de pagos
- `lib/supabase/queries/clientes.ts` — Queries `obtenerClienteConMembresia()` y `obtenerHistorialPagos()`
- `lib/supabase/queries/clientes.types.ts` — Tipos `ClienteConMembresiaCompleta`, `MembresiaDetalle`, `PagoResumen`
- `components/clientes/ListaClientes.tsx` — Badges de urgencia (Vence en X días, Venció hoy)
- `components/clientes/index.ts` — Exports de nuevos componentes

### Creados
- `components/clientes/BusquedaRapida.tsx` — Widget de búsqueda rápida para el dashboard
- `components/clientes/SeccionMembresia.tsx` — Sección de membresía en el detalle del cliente
- `components/clientes/HistorialPagos.tsx` — Lista de pagos recientes del cliente
- `app/api/buscar-clientes/route.ts` — API para sugerencias de búsqueda
- `app/api/dashboard/route.ts` — API para métricas del dashboard

### Sin modificar
- `components/clientes/BuscadorCliente.tsx` — Búsqueda en lista de clientes
- `components/clientes/FiltroMembresia.tsx` — Filtro por estado de membresía
- `components/clientes/TarjetaCliente.tsx` — Card de datos del perfil
- `components/clientes/FormularioEditarCliente.tsx` — Formulario de edición
- `lib/supabase/queries/clientes.transformations.ts` — Función `enrichConMembresia()`
- `app/recepcionista/layout.tsx` — Layout con navegación y protección de rol
- `proxy.ts` — Middleware de protección de rutas
