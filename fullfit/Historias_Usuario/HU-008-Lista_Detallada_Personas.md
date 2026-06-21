# HU-008: Lista Detallada de Personas Registradas

## Historia de Usuario
**Como** Recepcionista,
**Quiero** ver una lista detallada de todas las personas registradas,
**Para** tener visibilidad total de los clientes y el estado de sus matrículas.

## Estado
✅ Completada — Toda la funcionalidad de búsqueda detallada, resumen estadístico, tabla avanzada con exportación CSV y paginación debounce ha sido implementada.

## Lo que YA existe

### Listado de Clientes
- [x] `ListaClientes` — Tabla con columnas: Nombre, DNI, Email, Teléfono, Membresía (condicional), Estado, Acciones
- [x] `listarClientes()` — Query con paginación, filtros por estado de suscripción, enriquecimiento con datos de membresía
- [x] `enrichConMembresia()` — Transformación que agrega `membresia_estado` y `membresia_fecha_fin` a cada cliente
- [x] Paginación con botones anterior/siguiente y displays de "Página X de Y"
- [x] Conteo de resultados: "X cliente(s) encontrado(s)"

### Búsqueda y Filtros
- [x] `BuscadorCliente` — Búsqueda por nombre, DNI o teléfono con input limpiable
- [x] `FiltroMembresia` — Filtro por estado: Todos, Con membresía activa, Membresía vencida, Sin membresía
- [x] Combinación de búsqueda + filtro funcional
- [x] Reset automático a página 1 al cambiar filtro o búsqueda

### Badges de Estado
- [x] Badge "Activa" (verde) para membresías vigentes
- [x] Badge "Vencida" (rojo) con fecha para membresías expiradas
- [x] Badge "Sin membresía" (gris) para usuarios sin suscripción
- [x] Badge "Activo" / "Inactivo" para estado del perfil

### Acciones por Fila
- [x] Botón "Ver" (ícono ojo) → navega a `/recepcionista/clientes/{id}`
- [x] Botón "Editar" (ícono lápiz) → navega a `/recepcionista/clientes/{id}?edit=true`

### Infraestructura
- [x] `contarClientesPorEstado()` — Query que retorna conteo de activos/inactivos (existe en `clientes.ts` pero NO se usa en la página)
- [x] `proxy.ts` — Middleware protege rutas `/recepcionista/*`
- [x] Layout del recepcionista con navegación

## Lo que FALTA (No implementado)

### 1. Resumen Estadístico en la Lista
- [x] No se muestran estadísticas agregadas en la página de clientes (total, activos, inactivos, con/sin membresía)
- [x] `contarClientesPorEstado()` existe pero NO se invoca en `page.tsx`
- [x] No hay query `contarMembresiasPorEstado()` que retorne: activas, vencidas, por vencer (7 días), sin membresía
- [x] No hay cards o barra de resumen con métricas visuales antes de la tabla

### 2. Columnas Detalladas en la Tabla
- [x] La tabla NO muestra el **nombre del plan** de membresía (Mensual, Trimestral, Anual)
- [x] La tabla NO muestra la **fecha de vencimiento** de la suscripción
- [x] La tabla NO muestra los **días restantes** hasta el vencimiento
- [x] La tabla NO muestra la **fecha de registro** del cliente (`creado_en`)
- [x] La tabla solo muestra un badge genérico ("Activa"/"Vencida"), sin contexto del plan ni fechas

### 3. Enriquecimiento de Datos
- [x] `enrichConMembresia()` solo trae `estado` y `fecha_fin` de `suscripciones`
- [x] No hace JOIN con `planes_membresia` para obtener el nombre del plan
- [x] No calcula `dias_restantes` (diferencia entre fecha_fin y hoy en Lima)
- [x] No trae `fecha_inicio` de la suscripción
- [x] No trae el `precio` del plan para mostrar monto pagado

### 4. Ordenamiento (Sorting)
- [x] No hay ordenamiento por columnas (click en header para asc/desc)
- [x] La tabla siempre ordena por `nombre` asc (hardcodeado en `listarClientes()`)
- [x] No se puede ordenar por DNI, fecha de registro, fecha de vencimiento, estado

### 5. Indicadores Visuales de Urgencia
- [x] No hay badge amarillo para membresías por vencer (≤7 días)
- [x] No hay resaltado de fila para clientes con membresía vencida hoy
- [x] No hay tooltip con detalles del plan al hover sobre el badge de membresía
- [x] No hay indicador de "Vence en X días" en la tabla

### 6. Paginación Mejorada
- [x] No hay selector de cantidad de elementos por página (10, 25, 50, 100)
- [x] No hay botón de primera/última página
- [x] No hay input de número de página para salto directo
- [x] El límite está hardcodeado a 10 en `listarClientes()`

### 7. Exportación
- [x] No hay botón de exportar resultados a CSV/Excel
- [x] No hay generación de reporte PDF con la lista filtrada

### 8. Dashboard con Datos Reales
- [x] Las cards del dashboard muestran "--" (hardcodeado) en vez de datos reales
- [x] No se usa `contarClientesPorEstado()` en el dashboard
- [x] No hay conteo real de membresías activas ni por vencer en el dashboard

## Criterios de Aceptación

### 1. Resumen Estadístico (LO QUE FALTA)
- [x] **NUEVO:** Se muestra una barra de resumen ANTES de la tabla con:
  - [x] Total de clientes registrados
  - [x] Clientes activos (con badge verde)
  - [x] Clientes inactivos (con badge rojo/gris)
  - [x] Membresías activas
  - [x] Membresías vencidas
  - [x] Sin membresía
- [x] **NUEVO:** Las métricas se actualizan al aplicar búsqueda o filtros
- [x] **NUEVO:** Las métricas se cargan con `contarClientesPorEstado()` + `contarMembresiasPorEstado()`
- [x] **NUEVO:** Se muestra spinner de carga durante la carga de métricas

### 2. Tabla Detallada (LO QUE FALTA)
- [x] **NUEVO:** La tabla tiene las siguientes columnas:
  - [x] **Nombre completo** (nombre + apellido) — ya existe
  - [x] **DNI** — ya existe
  - [x] **Teléfono** — ya existe
  - [x] **Fecha de registro** — NUEVO: muestra `creado_en` en formato DD/MM/YYYY
  - [x] **Plan** — NUEVO: nombre del plan (Mensual/Trimestral/Anual) o "Sin plan"
  - [x] **Vencimiento** — NUEVO: fecha de fin de suscripción en formato DD/MM/YYYY
  - [x] **Días restantes** — NUEVO: número con color (verde >30, amarillo 7-30, rojo <7, tachado si venció)
  - [x] **Estado membresía** — Badge: Activa (verde), Vencida (rojo), Por vencer (amarillo), Sin membresía (gris)
  - [x] **Estado cliente** — Badge: Activo (verde), Inactivo (gris) — ya existe
  - [x] **Acciones** — Ver + Editar — ya existe
- [x] **NUEVO:** La columna Email se oculta en pantallas pequeñas (responsive)
- [x] **NUEVO:** Las columnas de fechas se alinean a la derecha

### 3. Enriquecimiento de Datos (LO QUE FALTA)
- [x] **NUEVO:** `enrichConMembresia()` se modifica para traer también:
  - [x] `membresia_plan_nombre` (JOIN con `planes_membresia`)
  - [x] `membresia_fecha_inicio`
  - [x] `membresia_precio`
  - [x] `dias_restantes` (calculado con `getFechaLima()`)
- [x] **NUEVO:** Tipo `ClienteConMembresia` se actualiza con nuevos campos
- [x] **NUEVO:** Si el cliente tiene múltiples suscripciones, se toma la más reciente (ya existe `ORDER BY fecha_fin DESC`)

### 4. Ordenamiento (LO QUE FALTA)
- [x] **NUEVO:** Click en header de columna ordena asc/desc
- [x] **NUEVO:** Icono de flecha indica dirección de ordenamiento activa
- [x] **NUEVO:** Columnas ordenables: Nombre, DNI, Fecha de registro, Plan, Vencimiento, Días restantes, Estado
- [x] **NUEVO:** El ordenamiento se aplica sobre los datos de la página actual (client-side) o se combina con la query (server-side)

### 5. Indicadores Visuales (LO QUE FALTA)
- [x] **NUEVO:** Badge amarillo "Por vencer" para membresías con ≤7 días restantes
- [x] **NUEVO:** Badge rojo intenso "Venció hoy" para membresías que vencen el día actual
- [x] **NUEVO:** Fila con fondo ligeramente resaltado para clientes con membresía vencida
- [x] **NUEVO:** Días restantes en rojo si es <7, amarillo si es 7-30, verde si es >30
- [x] **NUEVO:** Texto tachado en "Días restantes" si la membresía ya venció

### 6. Paginación (MEJORAS)
- [x] **NUEVO:** Selector de elementos por página: 10, 25, 50, 100
- [x] **NUEVO:** Botones de primera/última página (|< <| |> >|)
- [x] **NUEVO:** Input numérico de página para salto directo
- [x] Los botones anterior/siguiente se deshabilitan correctamente en límites

### 7. Búsqueda y Filtros (MEJORAS)
- [x] La búsqueda filtra por nombre, DNI, teléfono (ya funciona)
- [x] El filtro de membresía combina con la búsqueda (ya funciona)
- [x] **NUEVO:** La búsqueda tiene debounce de 300ms para evitar spam de queries
- [x] **NUEVO:** Se muestra spinner pequeño en el input de búsqueda durante la carga
- [x] **NUEVO:** Se muestra "0 resultados" en vez de "No se encontraron clientes" cuando hay búsqueda activa

### 8. Exportación (LO QUE FALTA)
- [x] **NUEVO:** Botón "Exportar CSV" que descarga la lista filtrada
- [x] **NUEVO:** El CSV incluye todas las columnas visibles de la tabla
- [x] **NUEVO:** El archivo se nombra `clientes_fullforma_YYYY-MM-DD.csv`
- [x] **NUEVO:** Se muestra spinner durante la generación del archivo

### 9. Validaciones y Casos de Borde
- [x] Si no hay clientes, se muestra "No se encontraron clientes"
- [x] Si el DNI tiene caracteres no numéricos, la búsqueda los ignora
- [x] Si el campo de búsqueda está vacío, se muestran todos los clientes
- [x] **NUEVO:** Si un cliente no tiene membresía, las columnas de plan/vencimiento/días muestran "-" / "Sin plan"
- [x] **NUEVO:** Si un cliente tiene membresía pero `fecha_fin` es null, se muestra "Sin fecha"
- [x] **NUEVO:** La paginación se recalcula al cambiar filtros
- [x] **NUEVO:** No se permiten valores negativos en "Días restantes" (se muestra 0 si venció)

### 10. UI/UX
- [x] Loading states con texto "Cargando clientes..."
- [x] Mensajes de error claros
- [x] Hover en filas con cambio de fondo sutil
- [x] **NUEVO:** Animación de fade-in al cargar nuevas páginas
- [x] **NUEVO:** La barra de resumen tiene fondo zinc-900 con bordes zinc-800
- [x] **NUEVO:** Las columnas de la tabla son responsive (se ocultan en móvil)
- [x] **NUEVO:** Tooltip al hover sobre badges de membresía con detalles del plan

### 11. Datos de Base de Datos
- [x] Tabla `profiles` tiene todos los campos necesarios
- [x] Tabla `suscripciones` tiene: usuario_id, plan_id, fecha_inicio, fecha_fin, estado
- [x] Tabla `planes_membresia` tiene: id, nombre, precio, duracion_dias
- [x] **NUEVO:** Query `contarMembresiasPorEstado()` que retorne: { activas, vencidas, por_vencer, sin_membresia }
- [x] **NUEVO:** `enrichConMembresia()` modificada para incluir datos del plan

## Archivos Relacionados

### Ya existentes (modificar)
- `app/recepcionista/clientes/page.tsx` — Agregar barra de resumen, sorting, paginación mejorada, exportación
- `components/clientes/ListaClientes.tsx` — Agregar columnas detalladas, sorting visual, indicadores de urgencia
- `components/clientes/index.ts` — Exportar nuevos componentes
- `lib/supabase/queries/clientes.ts` — Modificar `enrichConMembresia()`, agregar `contarMembresiasPorEstado()`, agregar sorting
- `lib/supabase/queries/clientes.types.ts` — Actualizar tipo `ClienteConMembresia` con nuevos campos
- `lib/supabase/queries/clientes.transformations.ts` — Modificar `enrichConMembresia()` para JOIN con planes
- `app/recepcionista/page.tsx` — Usar `contarClientesPorEstado()` para datos reales en dashboard

### Nuevos a crear
- `components/clientes/ResumenEstadistico.tsx` — Barra de métricas resumen antes de la tabla
- `components/clientes/ExportarCSV.tsx` — Botón de exportación a CSV
- `components/clientes/BadgeDiasRestantes.tsx` — Badge con color según días restantes

### Sin modificar
- `components/clientes/BuscadorCliente.tsx` — Ya funciona correctamente
- `components/clientes/FiltroMembresia.tsx` — Ya funciona correctamente
- `components/clientes/TarjetaCliente.tsx` — Se usa en detalle, no en lista
- `components/clientes/FormularioEditarCliente.tsx` — Se usa en detalle, no en lista
- `app/recepcionista/layout.tsx` — Ya tiene navegación y protección de rol
- `app/recepcionista/clientes/[id]/page.tsx` — Página de detalle (se modifica en HU-007)
- `proxy.ts` — Ya protege las rutas
