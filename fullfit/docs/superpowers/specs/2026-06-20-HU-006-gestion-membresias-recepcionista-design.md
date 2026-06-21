# HU-006: Gestión de Membresías por Recepcionista - Design Spec

## 1. Resumen

**Historia de Usuario**: Como Recepcionista, quiero gestionar las membresías de los clientes (cambiar estado, registrar, renovar y suspender), para manejar la membresía del cliente acorde a su situación.

**Alcance**: Solo operaciones de membresía (sin reportes ni estadísticas del dashboard).

**Métodos de pago**: Efectivo (con boleta PDF) + MercadoPago.

**Transiciones de estado permitidas**:
- `activa` → cancelar, pausar
- `suspendida` → reactivar, cancelar
- `cancelada` → reactivar
- `vencida` → renovar (solo si vence en ≤ 7 días)

---

## 2. Arquitectura

### 2.1 Estructura de archivos a crear

```
app/
├── recepcionista/
│   ├── membresias/
│   │   └── page.tsx                          # Página principal de membresías
│   └── clientes/
│       └── [id]/
│           └── page.tsx                      # MODIFICAR: agregar sección "Registrar Membresía"
├── api/
│   └── membresias/
│       ├── route.ts                          # GET (listar) + POST (registrar nueva)
│       └── [id]/
│           ├── route.ts                      # PATCH (cambiar estado)
│           └── renovar/
│               └── route.ts                  # POST (renovar membresía)
components/
└── membresias/
    ├── index.ts                              # Barrel export
    ├── ListaMembresias.tsx                   # Tabla de membresías
    ├── FormularioRegistrarMembresia.tsx      # Formulario de registro
    ├── ConfirmarAccion.tsx                   # Modal de confirmación
    ├── BadgeEstado.tsx                       # Badge de estado
    └── BadgeDiasRestantes.tsx                # Badge de días restantes
lib/
├── supabase/
│   └── queries/
│       ├── membresias.ts                     # Queries de membresías
│       └── membresias.types.ts               # Tipos TypeScript
└── utils/
    └── boleta.ts                             # Generación de boleta PDF
```

### 2.2 Dependencias a instalar

```bash
pnpm add jspdf jspdf-autotable
```

---

## 3. Base de Datos

### 3.1 Tablas existentes a utilizar

**`suscripciones`** - Tabla principal de membresías
- `id` (uuid, PK)
- `usuario_id` (uuid, FK → profiles)
- `plan_id` (uuid, FK → planes_membresia)
- `fecha_inicio` (date)
- `fecha_fin` (date)
- `estado` (text: 'activa', 'vencida', 'cancelada', 'suspendida')
- `creado_en` (timestamptz)

**`pagos`** - Registro de pagos
- `id` (uuid, PK)
- `suscripcion_id` (uuid, FK → suscripciones, nullable)
- `usuario_id` (uuid, FK → profiles)
- `monto` (numeric)
- `metodo_pago` (text: 'efectivo', 'mercadopago', etc.)
- `estado` (text: 'completado', 'pendiente', 'fallido')
- `referencia` (text, nullable) - Número de boleta
- `registrado_por` (uuid, FK → profiles) - Recepcionista
- `creado_en` (timestamptz)

**`planes_membresia`** - Planes disponibles
- `id` (uuid, PK)
- `nombre` (text)
- `precio` (numeric)
- `duracion_dias` (integer)
- `activo` (boolean)

### 3.2 Migración SQL ejecutada

```sql
-- Políticas RLS restrictivas para suscripciones y pagos
-- Solo recepcionistas (rol_id IN (1, 2)) pueden INSERT/UPDATE
-- Índices optimizados para búsquedas por fecha_fin, estado, usuario_id
```

---

## 4. Queries TypeScript

### 4.1 Tipos (`lib/supabase/queries/membresias.types.ts`)

```typescript
export interface MembresiaConCliente {
  id: string
  cliente: {
    id: string
    nombre: string
    apellido: string
    dni: string
  }
  plan: {
    id: string
    nombre: string
    precio: number
    duracion_dias: number
  }
  estado: 'activa' | 'vencida' | 'cancelada' | 'suspendida'
  fecha_inicio: string
  fecha_fin: string
  dias_restantes: number
  creado_en: string
}

export interface RegistrarMembresiaDTO {
  usuario_id: string
  plan_id: string
  metodo_pago: 'efectivo' | 'mercadopago'
  monto: number
}

export interface FiltroMembresia {
  buscar?: string
  estado?: string
  pagina: number
  por_pagina: number
}
```

### 4.2 Queries (`lib/supabase/queries/membresias.ts`)

```typescript
listarMembresias(filtros: FiltroMembresia): Promise<{ membresias: MembresiaConCliente[], total: number }>
obtenerMembresia(id: string): Promise<MembresiaConCliente>
registrarMembresia(datos: RegistrarMembresiaDTO): Promise<Suscripcion>
cancelarMembresia(id: string): Promise<void>
pausarMembresia(id: string): Promise<void>
reactivarMembresia(id: string): Promise<void>
renovarMembresia(id: string, planId: string): Promise<Suscripcion>
```

---

## 5. API Routes

### 5.1 GET /api/membresias

**Parámetros de query**: `buscar`, `estado`, `pagina`, `por_pagina`

**Retorna**: `{ membresias: MembresiaConCliente[], total: number }`

**Validaciones**:
- Autenticación requerida
- Rol recepcionista requerido (rol_id 1 o 2)

### 5.2 POST /api/membresias

**Body**:
```json
{
  "usuario_id": "uuid",
  "plan_id": "uuid",
  "metodo_pago": "efectivo | mercadopago",
  "monto": 100
}
```

**Lógica**:
1. Validar que el plan exista y esté activo
2. Verificar si el usuario ya tiene membresía activa
3. Si tiene membresía activa, solo permitir renovación
4. Crear suscripción en tabla `suscripciones`
5. Crear registro de pago en tabla `pagos`
6. Si es MercadoPago, crear preferencia y retornar `init_point`
7. Si es efectivo, generar boleta PDF

**Retorna**: `{ suscripcion, pago, boleta_url? }` o `{ preference_id, init_point }`

### 5.3 PATCH /api/membresias/[id]

**Body**:
```json
{
  "accion": "cancelar | pausar | reactivar"
}
```

**Transiciones permitidas**:
- `activa` → cancelar, pausar
- `suspendida` → reactivar, cancelar
- `cancelada` → reactivar
- `vencida` → NO permite acciones

### 5.4 POST /api/membresias/[id]/renovar

**Body**:
```json
{
  "plan_id": "uuid",
  "metodo_pago": "efectivo | mercadopago",
  "monto": 100
}
```

**Lógica**:
1. Validar que la membresía esté activa o venza en ≤ 7 días
2. Calcular nueva fecha_fin = fecha_fin_actual + duracion_dias_nuevo_plan
3. Actualizar suscripción con nueva fecha_fin y nuevo plan_id
4. Crear registro de pago

---

## 6. Componentes UI

### 6.1 ListaMembresias.tsx

- Tabla con columnas: Cliente, DNI, Plan, Estado, Inicio, Vencimiento, Días restantes, Acciones
- Filtros: Búsqueda por nombre/DNI + Filtro por estado
- Paginación con selector de 10, 25, 50 elementos
- Acciones por fila según estado de la membresía

### 6.2 FormularioRegistrarMembresia.tsx

- Se muestra en `/recepcionista/clientes/[id]`
- Selección de plan (lista de planes activos)
- Método de pago (Efectivo o MercadoPago)
- Resumen antes de confirmar
- Generación automática de boleta si es efectivo

### 6.3 ConfirmarAccion.tsx

- Modal de confirmación simple
- Título: "¿Confirmar [acción]?"
- Botones: "Cancelar" y "Confirmar"

### 6.4 BadgeEstado.tsx

- `activa`: Verde
- `vencida`: Rojo
- `cancelada`: Gris
- `suspendida`: Amarillo

### 6.5 BadgeDiasRestantes.tsx

- `>30 días`: Verde
- `7-30 días`: Amarillo
- `<7 días`: Rojo
- `0 o negativo`: Rojo intenso + "Vencida"

---

## 7. Flujo de Usuario

### 7.1 Registrar Nueva Membresía

1. Recepcionista navega a `/recepcionista/clientes/[id]`
2. Hace clic en "Registrar Membresía"
3. Selecciona plan y método de pago
4. Confirma registro
5. Si es efectivo: se genera boleta PDF
6. Si es MercadoPago: se redirige a checkout

### 7.2 Cambiar Estado de Membresía

1. Recepcionista navega a `/recepcionista/membresias`
2. Localiza la membresía en la tabla
3. Hace clic en la acción (Cancelar/Pausar/Reactivar)
4. Confirma en el modal
5. Se actualiza el estado

### 7.3 Renovar Membresía

1. Recepcionista localiza membresía que vence en ≤ 7 días
2. Hace clic en "Renovar"
3. Selecciona nuevo plan y método de pago
4. Confirma renovación
5. Se extiende la fecha_fin

---

## 8. Boleta PDF

### 8.1 Estructura

```
┌─────────────────────────────────────────────────────┐
│                    FULL FIT                          │
│              "Full Forma" - Trujillo                │
│                 RUC: 20XXXXXXX                       │
│          Av. Principal 123, Trujillo                 │
├─────────────────────────────────────────────────────┤
│  BOLETA DE VENTA                                    │
│  N°: BV-000001                                      │
│  Fecha: 20/06/2026                                  │
├─────────────────────────────────────────────────────┤
│  CLIENTE:                                           │
│  Nombre: Juan Pérez                                 │
│  DNI: 12345678                                      │
├─────────────────────────────────────────────────────┤
│  DETALLE                                            │
│  │ Concepto    │ Precio   │ Cant.   │ Subtotal   │ │
│  │ Plan Anual  │ S/ 480   │ 1       │ S/ 480     │ │
│                                        TOTAL: S/ 480│
├─────────────────────────────────────────────────────┤
│  MÉTODO DE PAGO: Efectivo                           │
│  Vigencia: 20/06/2026 - 20/06/2027                 │
├─────────────────────────────────────────────────────┤
│  ¡Gracias por entrenar con nosotros!                │
│  www.fullforma.vercel.app                           │
└─────────────────────────────────────────────────────┘
```

### 8.2 Datos del Gimnasio

```typescript
const DATOS_GIMNASIO = {
  nombre: 'Full Fit - Full Forma',
  direccion: 'Av. Principal 123, Trujillo',
  ruc: '20XXXXXXX',
  telefono: '(044) 123456',
  web: 'www.fullforma.vercel.app'
}
```

### 8.3 Numeración

- Prefijo: `BV-` (Boleta de Venta)
- Formato: `BV-000001` (secuencial)
- Se almacena en `pagos.referencia`

---

## 9. Validaciones

### 9.1 Server-side (API Routes)

**POST /api/membresias**:
- `usuario_id` requerido y válido (uuid)
- `plan_id` requerido, válido y activo
- `metodo_pago` debe ser 'efectivo' o 'mercadopago'
- `monto` debe ser >= 0
- Usuario NO debe tener membresía activa

**PATCH /api/membresias/[id]**:
- `id` debe existir
- `accion` requerida: 'cancelar', 'pausar', 'reactivar'
- Transiciones permitidas según estado actual

**POST /api/membresias/[id]/renovar**:
- Membresía debe estar activa o vencer en ≤ 7 días
- `plan_id` nuevo debe ser válido y activo

### 9.2 Client-side (Formularios)

- Plan requerido
- Método de pago requerido
- Spinner durante envío
- Deshabilitar botones durante operaciones

---

## 10. Seguridad

### 10.1 Autenticación

Todas las API Routes requieren:
1. `supabase.auth.getUser()` - Verificar autenticación
2. Verificar `rol_id IN (1, 2)` - Solo recepcionistas
3. Retornar 401 si no autenticado
4. Retornar 403 si no tiene permisos

### 10.2 RLS (Row Level Security)

Políticas ejecutadas en Supabase:
- `recepcionistas_crear_suscripciones` - INSERT en suscripciones
- `recepcionistas_actualizar_suscripciones` - UPDATE en suscripciones
- `recepcionistas_crear_pagos` - INSERT en pagos

### 10.3 Auditoría

Cada operación importante se registra en tabla `auditoria`:
- Registrar nueva membresía
- Cancelar membresía
- Pausar membresía
- Reactivar membresía
- Renovar membresía

---

## 11. Orden de Implementación

1. **Fase 1: Infraestructura** - Queries y tipos
2. **Fase 2: API Routes** - Endpoints de membresías
3. **Fase 3: Componentes UI** - Tabla, formularios, badges
4. **Fase 4: Páginas** - Página principal y modificación de detalle
5. **Fase 5: Boleta PDF** - Generación de boleta
6. **Fase 6: Testing** - Pruebas y ajustes

**Tiempo estimado**: 9-15 horas de desarrollo
