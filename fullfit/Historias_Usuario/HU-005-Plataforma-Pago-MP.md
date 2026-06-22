# HU-005: Implementación Plataforma de Pago — MercadoPago (Yape + Tarjetas)

## Historia de Usuario
**Como** Socio (miembro registrado),
**Quiero** pagar con Yape o tarjeta a través de MercadoPago,
**Para** usar los medios de pago más comunes en Perú.

## Estado
 Implementada

## Estado Actual del Pago

### Lo que YA existe (MercadoPago como plataforma)
- [x] `app/(marketing)/pasarelapago/page.tsx` — Página de pago con botón "Pagar con Mercado Pago"
- [x] `app/api/pagos/route.ts` — POST que crea preferencia MercadoPago y retorna `init_point`
- [x] `app/api/pagos/verificar/route.ts` — POST que verifica pago post-redirect, crea suscripción y registro de pago
- [x] `app/api/webhooks/mercadopago/route.ts` — Webhook server-to-server con verificación de firma HMAC
- [x] Acumulación de días restantes si renueva antes de vencer (ventana 7 días)
- [x] Deduplicación de pagos por campo `referencia`
- [x] Notificación al usuario al activar membresía (tabla `notificaciones`)
- [x] Registro de pagos fallidos en tabla `pagos` con estado 'fallido'
- [x] Redirección automática a `/login` si no está autenticado
- [x] Página de estado post-pago: aprobado, rechazado, pendiente

## Criterios de Aceptación

### 1. Flujo de Pago con MercadoPago
- [x] Al hacer clic en "Pagar con Mercado Pago", se llama a `POST /api/pagos` con `planId`
- [x] La API valida autenticación del usuario
- [x] La API valida que el plan exista y esté activo
- [x] La API verifica si el usuario ya tiene membresía activa (ventana 7 días para acumular)
- [x] Se crea preferencia MercadoPago con items, metadata y back_urls
- [x] Se redirige al usuario a `init_point` de MercadoPago
- [x] MercadoPago acepta Yape y tarjetas (débito/crédito) como métodos de pago

### 2. Verificación Post-Pago
- [x] Al regresar de MercadoPago con `status=approved` y `payment_id`, se llama a `POST /api/pagos/verificar`
- [x] Se verifica que el pago no haya sido procesado previamente (deduplicación)
- [x] Se crea suscripción en tabla `suscripciones` con estado 'activa'
- [x] Se crea registro en tabla `pagos` con estado 'completado'
- [x] Se crea notificación de bienvenida al usuario

### 3. Webhook MercadoPago
- [x] Recibe notificación server-to-server cuando cambia estado de pago
- [x] Verifica firma HMAC con `MP_WEBHOOK_SECRET`
- [x] Procesa solo pagos con estado 'approved'
- [x] Maneja caso de membresía activa existente (registra pago sin suscripción)
- [x] Maneja pagos rechazados (registra en `pagos` con estado 'fallido')

### 4. Autenticación
- [x] Si no está autenticado, redirige a `/login?redirect=/pasarelapago?plan={id}`
- [x] La API de pago valida sesión activa con `supabase.auth.getUser()`
- [x] La API de verificación usa `SUPABASE_SERVICE_ROLE_KEY` para operaciones server-side

## Métodos de Pago Aceptados (vía MercadoPago)
- Yape
- Tarjeta de débito
- Tarjeta de crédito
- Pago en efectivo (agente MP)

## Archivos Relacionados
- `app/(marketing)/pasarelapago/page.tsx`
- `app/api/pagos/route.ts`
- `app/api/pagos/verificar/route.ts`
- `app/api/webhooks/mercadopago/route.ts`
- `lib/mercadopago.ts`
- `lib/mercadopago-preferencia.ts`
- `lib/supabase/queries/pagos.ts`
