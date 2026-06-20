# HU-006: Recepcionista — Correcciones al CSV

## Discrepancias encontradas entre el CSV y la implementación real

| CP | CSV Dice | Realidad | Acción |
|---|---|---|---|
| CP-41 | "Redirección a /login si no autenticado" | ✅ El middleware en `proxy.ts` redirige a `/login` para todas las rutas `/recepcionista/*` si no hay sesión. | Sin cambios |
| CP-42 | "Vista de dashboard carga correctamente" | ⚠️ **Depende de autenticación.** Sin sesión activa, redirige a login. Con sesión, muestra dashboard con cards de estadísticas con valores placeholder "--". | Aceptar: las pruebas requieren una sesión de Supabase |
| CP-43 | "Sidebar/Nav con enlaces" | ⚠️ **Requiere autenticación.** El layout contiene header con enlaces a Clientes, Membresías, Reportes, más botón de logout y nombre del usuario. | Las pruebas necesitan sesión activa |
| CP-44 | "Cards de estadísticas visibles" | ⚠️ **Requiere autenticación.** Dashboard tiene 3 cards: "Total Clientes", "Membresías Activas", "Membresías por Vencer", todos con valor "--" (placeholder). | Las pruebas necesitan sesión activa |
| CP-49 | "Página de Membresías 'Próximamente'" | ⚠️ **Requiere autenticación.** Página placeholder con título "Próximamente" y lista de funcionalidades futuras. | Las pruebas necesitan sesión activa |
| CP-50 | "Página de Reportes 'Próximamente'" | ⚠️ **Requiere autenticación.** Página placeholder con título "Próximamente" y lista de funcionalidades futuras. | Las pruebas necesitan sesión activa |

## Observaciones adicionales
- **El mayor desafío de pruebas:** todas las rutas `/recepcionista/*` están protegidas por middleware que redirige a `/login` si no hay sesión de Supabase.
- Las pruebas automatizadas de las páginas protegidas (CP-42, 43, 44, 49, 50) solo pueden ejecutarse si se establece una sesión de Supabase válida mediante la API de autenticación.
- El layout verifica roles: `profile.rol_id` debe ser 1 (admin) o 2 (recepcionista). Un usuario normal no autenticado no tiene acceso.
- Los datos de clientes se cargan mediante `listarClientes()` desde Supabase y **no hay seed data** — la tabla `clientes` puede estar vacía en desarrollo.
- Las pruebas marcadas como **Manual** en el CSV (CP-45 al 48: tabla, agregar cliente, búsqueda, paginación) no se implementan.

## Pruebas no implementadas (Manuales en CSV)
- CP-45: Tabla de clientes con columnas correctas (Manual)
- CP-46: Botón "Agregar Cliente" funciona (Manual)
- CP-47: Barra de búsqueda filtra clientes (Manual)
- CP-48: Paginación funciona (Manual)
