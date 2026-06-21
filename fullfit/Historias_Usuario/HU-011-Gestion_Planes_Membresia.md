# HU-011: Gestión de Planes de Membresía

## Historia de Usuario
**Como** Gerente,
**Quiero** crear y configurar planes de membresía,
**Para** brindarle a los clientes potenciales opciones para su membresía.

## Estado
🔴 No implementada — La tabla `planes_membresia` existe y se muestra en la web pública, pero no hay panel de administración para gestionar planes. Las features están hardcodeadas en `constants/plans.ts`.

## Lo que YA existe

### Tabla `planes_membresia` (BD)
- [x] Campos: id, nombre, descripcion, precio, duracion_dias, activo, creado_en
- [x] Constraints: precio ≥ 0, duracion_dias > 0
- [x] Default activo: true
- [x] Types TypeScript: `PlanMembresia`, `PlanMembresiaInsert`, `PlanMembresiaUpdate`

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

### Infraestructura
- [x] `proxy.ts` — Protege rutas admin
- [x] Layout del recepcionista con navegación (link "Membresías" ya existe)
- [x] `app/recepcionista/membresias/page.tsx` — Placeholder "Próximamente"

### Consumo de Planes
- [x] `app/api/pagos/route.ts` — Lee plan de `planes_membresia` para crear preferencia MercadoPago
- [x] `lib/supabase/queries/pagos.ts` — Valida plan activo antes de procesar pago
- [x] La web pública solo muestra planes con `activo = true`

## Lo que FALTA (No implementado)

### 1. Panel de Administración de Planes
- [ ] No existe ruta funcional `/recepcionista/planes` (solo placeholder)
- [ ] No hay link dedicado a "Gestionar Planes" en la navegación del admin
- [ ] No hay sección de administración de planes

### 2. CRUD de Planes
- [ ] **Crear plan:** No existe formulario de alta
  - [ ] No hay query `crearPlan(datos)`
  - [ ] No hay componente `FormularioCrearPlan`
  - [ ] No hay validación de nombre único
- [ ] **Editar plan:** No existe formulario de edición
  - [ ] No hay query `obtenerPlan(id)` para admin
  - [ ] No hay query `actualizarPlan(id, datos)`
  - [ ] No hay componente `FormularioEditarPlan`
- [ ] **Desactivar/Activar plan:** No existe lógica
  - [ ] No hay query `cambiarEstadoPlan(id, activo)`
  - [ ] No hay confirmación de desactivación
  - [ ] No hay validación de que no se puede desactivar un plan con suscripciones activas
- [ ] **Eliminar plan:** No existe (soft delete / desactivar)

### 3. Gestión de Features/Beneficios
- [ ] Las features están hardcodeadas en `constants/plans.ts` — no son editables desde admin
- [ ] No hay campo `features` o `beneficios` en la tabla `planes_membresia`
- [ ] No hay componente `EditorFeatures` para agregar/quitar beneficios
- [ ] No hay migración SQL para agregar columna de features (JSONB o relación)

### 4. Queries de Base de Datos
- [ ] No existe `listarPlanesAdmin()` que traiga todos (activos + inactivos)
- [ ] No existe `obtenerPlan(id)` para admin
- [ ] No existe `crearPlan(datos)` con insert
- [ ] No existe `actualizarPlan(id, datos)` con update
- [ ] No existe `cambiarEstadoPlan(id, activo)` para activar/desactivar
- [ ] No existe `contarSuscripcionesPorPlan(planId)` para validar antes de desactivar

### 5. API Routes
- [ ] No existe `GET /api/planes` para admin (listar todos)
- [ ] No existe `POST /api/planes` para crear
- [ ] No existe `PUT /api/planes/[id]` para actualizar
- [ ] No existe `PATCH /api/planes/[id]/estado` para activar/desactivar

### 6. UI/Componentes
- [ ] No existe `ListaPlanes.tsx` — Tabla de planes para admin
- [ ] No existe `TarjetaPlanAdmin.tsx` — Card de plan con acciones
- [ ] No existe `FormularioPlan.tsx` — Formulario de crear/editar
- [ ] No existe `EditorFeatures.tsx` — Editor de beneficios del plan
- [ ] No existe `ConfirmarDesactivarPlan.tsx` — Modal de confirmación
- [ ] No existe `BadgePlan.tsx` — Badge con estado del plan

### 7. Impacto en Página Pública
- [ ] Si se agrega campo `features` a BD, la página pública debe leer de BD en vez de `constants/plans.ts`
- [ ] Si se mantiene hardcoded, no hay problema pero no es configurable
- [ ] **Decisión necesaria:** ¿Las features se migran a BD o se mantienen en constants?

### 8. Validaciones
- [ ] No hay validación de nombre unique al crear/editar
- [ ] No hay validación de precio > 0
- [ ] No hay validación de duracion_dias > 0
- [ ] No hay validación de que no se puede desactivar un plan con suscripciones activas
- [ ] No hay límite de planes activos simultáneos

## Criterios de Aceptación

### 1. Acceso y Permisos
- [ ] Solo usuarios con rol de gerente (o admin) pueden crear/editar/desactivar planes
- [ ] Los recepcionistas pueden VER la lista de planes pero NO editar
- [ ] La página pública `/membresias` solo muestra planes con `activo = true`

### 2. Lista de Planes (Admin)
- [ ] Se muestra tabla con: Nombre, Descripción, Precio, Duración, Estado (badge), Fecha creación, Acciones
- [ ] Badge de estado: Activo (verde), Inactivo (rojo)
- [ ] Filtro por estado: Todos, Activos, Inactivos
- [ ] Búsqueda por nombre
- [ ] Acciones: Ver detalle, Editar, Desactivar/Activar
- [ ] El plan "Más Popular" se marca con badge especial (configurable)

### 3. Crear Plan
- [ ] Botón "Nuevo Plan" abre formulario
- [ ] Campos: Nombre*, Descripción, Precio* (S/), Duración en días*, Estado (activo/inactivo)
- [ ] Validaciones: nombre requerido y unique, precio ≥ 0, duración > 0
- [ ] Se muestra preview del plan creado (nombre, precio, duración)
- [ ] Al éxito, se muestra toast y se actualiza la lista
- [ ] Si hay error (nombre duplicado), se muestra mensaje claro

### 4. Editar Plan
- [ ] Botón "Editar" abre formulario con datos existentes
- [ ] Todos los campos son editables
- [ ] El nombre unique se valida excluyendo el plan actual
- [ ] Se muestra spinner durante actualización
- [ ] Si el plan tiene suscripciones activas, se advierte que los cambios aplican a nuevos pagos

### 5. Desactivar/Activar Plan
- [ ] Botón "Desactivar" (para activos) / "Activar" (para inactivos)
- [ ] Modal de confirmación: "¿Desactivar plan [Nombre]?"
- [ ] Si el plan tiene suscripciones activas, se muestra advertencia: "Este plan tiene X suscripciones activas. Los miembros actuales mantendrán su acceso hasta la fecha de vencimiento."
- [ ] Al confirmar, se cambia `activo = false`
- [ ] El plan desactivado desaparece de `/membresias` pública
- [ ] Las suscripciones existentes NO se ven afectadas (mantienen acceso)

### 6. Gestión de Features (Opcional / Fase 2)
- [ ] **Opción A (Recomendada):** Migrar features a BD
  - [ ] Nueva tabla `plan_features` con: id, plan_id, nombre, orden
  - [ ] O campo JSONB `features` en `planes_membresia`
  - [ ] Editor de features en el formulario de plan
  - [ ] La página pública lee features de BD en vez de `constants/plans.ts`
- [ ] **Opción B (Mínima):** Mantener features en `constants/plans.ts`
  - [ ] Las features siguen hardcodeadas
  - [ ] El admin solo gestiona: nombre, descripción, precio, duración, estado
  - [ ] Menor esfuerzo pero no configurable

### 7. Página Pública (verificar)
- [x] Solo muestra planes con `activo = true`
- [x] Muestra nombre, descripción, precio, features
- [x] Badge "Más Popular" para plan Trimestral
- [ ] **NUEVO:** Si no hay planes activos, muestra "Próximamente" en vez de vacío

### 8. UI/UX
- [ ] Loading states con spinner
- [ ] Empty state "No hay planes configurados"
- [ ] Mensajes de error claros en español
- [ ] Estilo consistente con el resto del admin (fondo zinc-950, borders zinc-800, amarillo para acentos)
- [ ] Formulario con diseño de cards (estilo similar a la página pública)

### 9. Datos de Base de Datos
- [x] Tabla `planes_membresia` tiene todos los campos necesarios
- [x] Types TypeScript ya definidos
- [ ] **NUEVO:** RLS policy para que solo admin/gerente pueda INSERT/UPDATE en `planes_membresia`
- [ ] **NUEVO (si Opción A):** Migración SQL para campo `features` o tabla `plan_features`

### 10. Validaciones y Casos de Borde
- [ ] No se puede crear dos planes con el mismo nombre
- [ ] No se puede poner precio negativo
- [ ] No se puede poner duración 0 o negativa
- [ ] No se puede desactivar un plan que tenga suscripciones activas (solo con confirmación)
- [ ] Al desactivar un plan, las suscripciones existentes mantienen acceso hasta vencimiento
- [ ] Al editar precio, solo aplica a nuevos pagos (no a suscripciones activas)

## Archivos Relacionados

### Nuevos a crear
- `app/recepcionista/planes/page.tsx` — Página de gestión de planes (reemplaza placeholder)
- `components/planes/ListaPlanes.tsx` — Tabla de planes para admin
- `components/planes/FormularioPlan.tsx` — Formulario de crear/editar
- `components/planes/ConfirmarDesactivarPlan.tsx` — Modal de confirmación
- `components/planes/BadgePlan.tsx` — Badge con estado del plan
- `components/planes/index.ts` — Barrel export
- `lib/supabase/queries/planes.ts` — Queries CRUD de planes
- `lib/supabase/queries/planes.types.ts` — Tipos para gestión de planes
- `app/api/planes/route.ts` — GET (admin) + POST (crear)
- `app/api/planes/[id]/route.ts` — PUT (actualizar) + PATCH (estado)

### A modificar
- `proxy.ts` — Agregar ruta `/recepcionista/planes` al matcher
- `app/recepcionista/layout.tsx` — Agregar link "Planes" en la navegación (ya existe como "Membresías")
- `app/recepcionista/membresias/page.tsx` — Reemplazar placeholder con listado funcional
- `app/(marketing)/membresias/page.tsx` — Manejar caso "sin planes activos"
- `@BaseDatos_Supabase/rls-policies/recepcionista-clientes.sql` — Agregar RLS para `planes_membresia`
- `constants/plans.ts` — Mantener como fallback o eliminar si se migra a BD

### Sin modificar
- `app/api/pagos/route.ts` — Ya lee planes de BD (no se modifica)
- `lib/supabase/queries/pagos.ts` — Ya valida plan activo (no se modifica)
- `lib/supabase/types.ts` — Ya tiene tipos de `planes_membresia` (no se modifica)
- `app/(marketing)/pasarelapago/page.tsx` — Flujo de pago (no se modifica)
