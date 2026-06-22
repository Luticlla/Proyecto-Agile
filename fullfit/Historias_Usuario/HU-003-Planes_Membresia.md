# HU-003: Planes de Membresía

## Historia de Usuario
**Como** Socio (visitante),
**Quiero** ver los planes de membresía disponibles,
**Para** elegir el plan que mejor se ajuste a mis necesidades y presupuesto.

## Estado
✅ Implementada

## Criterios de Aceptación

### 1. Hero Section
- [x] Título "Elige tu Membresía" con "Membresía" resaltado en amarillo con text-shadow
- [x] Subtítulo: "Entrena sin límites en cualquiera de nuestras sedes"
- [x] Contador dinámico del número de planes activos
- [x] Indicador "100% Flexible"

### 2. Tarjetas de Planes
- [x] Cada plan muestra: nombre, descripción (si existe), precio total ("S/ X"), precio por mes ("S/ X/mes")
- [x] Lista de features/beneficios definida en `constants/plans.ts` por nombre del plan
- [x] Botón "Elegir Plan" enlaza a `/pasarelapago?plan={id}`
- [x] Plan "Trimestral" tiene badge "Más Popular" y borde amarillo (estilo diferenciado)
- [x] Cálculo de precio por mes: `Math.round(price / (days / 30))`

### 3. Sección Inferior
- [x] Texto: "¿Tienes dudas sobre qué plan elegir? Visítanos en cualquiera de nuestras sedes"
- [x] Enlace "Visítanos" redirige a `/sedes`

### 4. Flujo Post-Selección
- [x] Si no ha iniciado sesión, redirige a `/login?redirect=/pasarelapago?plan={id}`
- [x] Si ha iniciado sesión, muestra resumen del plan en `/pasarelapago`
- [x] Botón "Pagar con Mercado Pago" inicia flujo de pago

### 5. Datos de BD (tabla `planes_membresia`)
- id, nombre, descripcion, precio, duracion_dias, activo, creado_en

### 6. Features por Plan (constants/plans.ts)
- **Mensual**: Acceso a todas las sedes, Área de pesas y máquinas, Vestuarios y locker
- **Trimestral**: + Clases grupales ilimitadas, Evaluación corporal mensual
- **Anual**: Acceso prioritario a eventos

## Archivos Relacionados
- `app/(marketing)/membresias/page.tsx`
- `app/(marketing)/pasarelapago/page.tsx`
- `constants/plans.ts`
- `app/api/pagos/route.ts`
- `app/api/pagos/verificar/route.ts`
- `app/api/webhooks/mercadopago/route.ts`
