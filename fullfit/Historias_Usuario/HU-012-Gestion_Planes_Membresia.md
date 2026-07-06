# HU-012: Gestión de Planes de Membresía

## Historia de Usuario
**Como** Gerente,
**Quiero** crear y configurar planes de membresía,
**Para** brindarle a los clientes potenciales opciones para su membresía.

## Estado
🟡 Parcialmente implementada — La tabla `planes_membresia` existe con datos, la página pública muestra planes activos, y existe un endpoint GET básico. Falta el panel de administración CRUD completo.

## Lo que YA existe

### Tabla `planes_membresia` (BD)
- [x] Campos: id, nombre, descripcion, precio, duracion_dias, activo, creado_en
- [x] Constraints: precio ≥ 0, duracion_dias > 0
- [x] Default activo: true
- [x] Types TypeScript: `PlanMembresia`, `PlanMembresiaInsert` en `lib/supabase/types.ts`

### Página Pública de Planes
- [x] `app/(marketing)/membresias/page.tsx` — Server component que fetch planes activos
- [x] Muestra: nombre, descripción, precio total, precio por mes, features, badge "Más Popular"
- [x] Botón "Elegir Plan" enlaza a `/pasarelapago?plan={id}`
- [x] Fetch con `createAnonServerClient()` (sin auth, datos públicos)
- [x] Contador dinámico de planes activos

### Features Hardcoded
- [x] `constants/plans.ts` — Mapa de features por nombre de plan (Mensual, Trimestral, Anual)
- [x] `formatPrice()` — Calcula precio total y por mes
- [x] **Problema:** Las features NO están en la BD, son estáticas en código

### API Route Existente
- [x] `app/api/planes/route.ts` — GET con `requireAuthenticated()` que retorna solo planes activos
- [x] **Limitación:** Solo retorna planes activos, no es apto para admin (necesita todos)

### Infraestructura
- [x] `proxy.ts` — Protege rutas `/recepcionista/*`, `/gerente/*`, `/pasarelapago/*`
- [x] Layout del gerente con navegación (links: Usuarios, Sedes)
- [x] `lib/auth/api-guard.ts` — `requireAuthenticated()` y `requireAuthenticatedRecepcionista()`
- [x] Patrón CRUD establecido en sedes y usuarios (queries + API routes + componentes)

### Consumo de Planes
- [x] `app/api/pagos/route.ts` — Lee plan de `planes_membresia` para crear preferencia MercadoPago
- [x] `lib/supabase/queries/pagos.ts` — Valida plan activo antes de procesar pago
- [x] La web pública solo muestra planes con `activo = true`

### Gestión de Membresías (existe, NO es placeholder)
- [x] `app/recepcionista/membresias/page.tsx` — Página funcional de gestión de membresías de clientes
- [x] `components/membresias/` — Componentes completos (ListaMembresias, FormularioRegistrarMembresia, etc.)
- [x] **Nota:** Esta página gestiona membresías de clientes, NO planes. No se modifica.

## Lo que FALTA (No implementado)

### 1. Panel de Administración de Planes
- [ ] No existe ruta `/gerente/planes` (debe ir en gerente, no en recepcionista)
- [ ] No hay link "Planes" en la navegación del gerente (`app/gerente/layout.tsx`)
- [ ] No hay página de gestión de planes

### 2. Queries de Base de Datos
- [ ] No existe `listarPlanesAdmin()` — Trae todos los planes (activos + inactivos) con paginación
- [ ] No existe `obtenerPlanPorId(id)` — Obtiene un plan por ID
- [ ] No existe `crearPlan(datos)` — Inserta un nuevo plan
- [ ] No existe `actualizarPlan(id, datos)` — Actualiza un plan existente
- [ ] No existe `cambiarEstadoPlan(id, activo)` — Activa/desactiva un plan
- [ ] No existe `contarSuscripcionesActivasPorPlan(planId)` — Cuenta suscripciones activas de un plan

### 3. API Routes CRUD
- [ ] `GET /api/planes` — Necesita modificación: traer TODOS los planes (admin), no solo activos
- [ ] No existe `POST /api/planes` — Crear plan (solo gerente)
- [ ] No existe `GET /api/planes/[id]` — Obtener plan por ID
- [ ] No existe `PUT /api/planes/[id]` — Actualizar plan (solo gerente)
- [ ] No existe `PATCH /api/planes/[id]/estado` — Activar/desactivar (solo gerente)

### 4. UI/Componentes
- [ ] No existe `components/planes/ListaPlanesAdmin.tsx` — Tabla de planes para admin
- [ ] No existe `components/planes/FormularioPlan.tsx` — Formulario de crear/editar
- [ ] No existe `components/planes/ConfirmarDesactivarPlan.tsx` — Modal de confirmación
- [ ] No existe `components/planes/BadgeEstadoPlan.tsx` — Badge con estado del plan
- [ ] No existe `components/planes/index.ts` — Barrel export

### 5. Gestión de Features/Beneficios
- [ ] Las features están hardcodeadas en `constants/plans.ts` — no son editables desde admin
- [ ] No hay campo `features` en la tabla `planes_membresia`
- [ ] No hay migración SQL para agregar columna de features
- [ ] **Decisión:** Migrar a BD (JSONB) o mantener en constants

### 6. Validaciones
- [ ] No hay validación de nombre único al crear/editar
- [ ] No hay validación de que no se puede desactivar un plan con suscripciones activas (solo con confirmación)
- [ ] No hay límite de planes activos simultáneos

### 7. RLS Policies
- [ ] No hay RLS policies para `planes_membresia` — Solo admin/gerente puede INSERT/UPDATE
- [ ] El archivo `@BaseDatos_Supabase/rls-policies/recepcionista-clientes.sql` no incluye `planes_membresia`

## Criterios de Aceptación

### 1. Acceso y Permisos
- [ ] Solo el gerente (rol_id = 1) puede crear, editar o desactivar planes
- [ ] Si un recepcionista intenta acceder a `/gerente/planes`, se le redirige a `/recepcionista`
- [ ] Si un miembro intenta acceder, se le redirige a `/membresias`
- [ ] La página pública `/membresias` solo muestra planes con `activo = true`

### 2. Panel de Gestión
- [ ] Existe sección "Planes" en la navegación del gerente (`app/gerente/layout.tsx`)
- [ ] Título: "Gestión de Planes de Membresía" con subtítulo descriptivo
- [ ] Botón "Nuevo Plan" para agregar
- [ ] Tabla con todos los planes (activos + inactivos)

### 3. Tabla de Planes
**Columnas de la tabla:**
- [ ] **Nombre:** nombre del plan
- [ ] **Descripción:** descripción breve
- [ ] **Precio:** precio en soles (S/)
- [ ] **Duración:** días del plan
- [ ] **Estado:** badge verde (Activo) o rojo (Inactivo)
- [ ] **Creado:** fecha de creación
- [ ] **Acciones:** Editar, Desactivar/Activar

### 4. Crear Plan
- [ ] Botón "Nuevo Plan" abre formulario (Dialog)
- [ ] Campos: Nombre*, Descripción, Precio* (S/), Duración en días*, Estado (activo/inactivo)
- [ ] Validaciones: nombre requerido y unique, precio ≥ 0, duración > 0
- [ ] Al éxito: toast de confirmación y se actualiza la tabla
- [ ] Si hay error (nombre duplicado): mensaje claro en español

### 5. Editar Plan
- [ ] Botón "Editar" abre formulario con datos existentes
- [ ] Todos los campos son editables
- [ ] El nombre unique se valida excluyendo el plan actual
- [ ] Spinner durante actualización
- [ ] Si el plan tiene suscripciones activas, se advierte que los cambios aplican a nuevos pagos

### 6. Desactivar/Activar Plan
- [ ] Botón "Desactivar" (para activos) / "Activar" (para inactivos)
- [ ] Modal de confirmación: "¿Desactivar plan [Nombre]?"
- [ ] Si el plan tiene suscripciones activas, se muestra advertencia con cantidad
- [ ] Al confirmar: cambia `activo = false` y se actualiza la tabla
- [ ] El plan desactivado desaparece de `/membresias` pública
- [ ] Las suscripciones existentes NO se ven afectadas

### 7. Página Pública (verificar)
- [x] Solo muestra planes con `activo = true`
- [x] Muestra nombre, descripción, precio, features
- [ ] Si no hay planes activos, mostrar "Próximamente" en vez de vacío

### 8. Filtros y Búsqueda
- [ ] Campo de búsqueda por nombre
- [ ] Filtro por estado: Todos, Activos, Inactivos
- [ ] Filtros combinables

### 9. UI/Estilo
- [ ] Tema oscuro consistente (fondo zinc-950, borders zinc-800)
- [ ] Badges de estado con colores consistentes
- [ ] Formularios con diseño de cards
- [ ] Loading states con spinner
- [ ] Empty state "No hay planes configurados"
- [ ] Mensajes de error claros en español

### 10. Seguridad
- [ ] RLS policy para `planes_membresia`: solo admin/gerente puede INSERT/UPDATE
- [ ] API routes validan rol de gerente antes de CRUD
- [ ] Datos públicos (solo lectura) no requieren autenticación

## Archivos Relacionados

### Nuevos a crear
- `app/gerente/planes/page.tsx` — Página de gestión de planes
- `components/planes/ListaPlanesAdmin.tsx` — Tabla de planes para admin
- `components/planes/FormularioPlan.tsx` — Formulario de crear/editar
- `components/planes/ConfirmarDesactivarPlan.tsx` — Modal de confirmación
- `components/planes/BadgeEstadoPlan.tsx` — Badge con estado del plan
- `components/planes/index.ts` — Barrel export
- `lib/supabase/queries/planes.ts` — Queries CRUD de planes
- `lib/supabase/queries/planes.types.ts` — Tipos para gestión de planes
- `app/api/planes/[id]/route.ts` — GET (por ID) + PUT (actualizar)
- `app/api/planes/[id]/estado/route.ts` — PATCH (activar/desactivar)

### A modificar
- `app/gerente/layout.tsx` — Agregar link "Planes" en la navegación
- `app/api/planes/route.ts` — Modificar GET para admin (traer todos) + agregar POST
- `app/(marketing)/membresias/page.tsx` — Manejar caso "sin planes activos"
- `@BaseDatos_Supabase/rls-policies/recepcionista-clientes.sql` — Agregar RLS para `planes_membresia`
- `lib/supabase/types.ts` — Agregar campo `features` y tipo `PlanMembresiaUpdate`

### Sin modificar
- `app/recepcionista/membresias/page.tsx` — Gestión de membresías de clientes (no es placeholder)
- `app/api/pagos/route.ts` — Ya lee planes de BD
- `lib/supabase/queries/pagos.ts` — Ya valida plan activo
- `app/(marketing)/pasarelapago/page.tsx` — Flujo de pago
- `constants/plans.ts` — Se mantiene como fallback hasta migrar features a BD
- `proxy.ts` — Ya protege `/gerente/:path*` (no necesita cambios)
