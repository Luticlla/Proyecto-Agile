# HU-005: Pasarela de Pagos — Correcciones al CSV

## Discrepancias encontradas entre el CSV y la implementación real

| CP | CSV Dice | Realidad | Acción |
|---|---|---|---|
| CP-33 | "Redirección a /login si no autenticado" | ✅ El middleware redirige a `/login` si el usuario no tiene sesión. La página de pago requiere autenticación. | Sin cambios |
| CP-34 | "Error si plan no existe" | ⚠️ La página obtiene el plan mediante `getPlanById(id)` en Supabase. Si no se encuentra, debe mostrar error. Pero la redirección a login ocurre antes de que se evalúe el plan. | El error de plan inexistente solo se ve si el usuario está autenticado |
| CP-35 | "Página sin plan_id muestra mensaje de selección" | ❌ El código actual redirige al home si no hay `plan_id` en los params. El CSV espera un mensaje de "selecciona un plan". | **Requiere modificar fuente** para mostrar un estado informativo en lugar de redirigir |
| CP-37 | "Página de estado 'aprobado' muestra éxito" | ✅ La página maneja `status=approved` y muestra mensaje de confirmación. | Sin cambios |
| CP-38 | "Página de estado 'rechazado' muestra fallo" | ✅ La página maneja `status=rejected` y muestra mensaje de error. | Sin cambios |
| CP-39 | "Página de estado 'pendiente' muestra espera" | ✅ La página maneja `status=pending` y muestra mensaje de espera. | Sin cambios |

## Observaciones adicionales
- La integración real con Mercado Pago requiere `MERCADO_PAGO_ACCESS_TOKEN` (service-side).
- Las pruebas de pago real (CP-17, CP-18 del CSV original) son **Manuales** — requieren tarjeta de prueba de Mercado Pago.
- La página de pasarela es Client Component con `useSearchParams()` y `useAuth()`.
- Usa el componente `<MercadoPagoButton />` que requiere Mercado Pago SDK.
