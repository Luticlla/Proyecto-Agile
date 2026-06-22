# Documentación de Pruebas Automatizadas

## Resumen

- **Total CPs en CSV:** 237 (129 Automatico + 102 Manual + 6 Rendimiento)
- **Archivos de test:** 10
- **Pruebas ejecutadas:** 153 (116 passed + 35 skip internos + 2 skip HU-007)
- **Passed:** 116
- **Skipped:** 35 (tests internos con `test.skip(true)` por falta de datos BD)
- **Failed:** 0

## Archivos de Test

### `tests/hu01-landing-page.spec.ts` — 34 tests (todos activos)
Covers: CP-01 through CP-40 (Landing Page Informativa)

### `tests/hu02-sedes.spec.ts` — 21 tests (todos activos)
Covers: CP-01 through CP-21 (Listado de Sedes)

### `tests/hu03-membresias.spec.ts` — 18 tests (todos activos)
Covers: CP-01 through CP-18 (Planes de Membresía)

### `tests/hu04-register.spec.ts` — 25 tests (todos activos)
Covers: CP-01 through CP-25 (Registro de Datos Personales)

### `tests/hu05-pagos.spec.ts` — 20 tests (todos activos)
Covers: CP-02, CP-04, CP-05, CP-08, CP-09, CP-15-18, CP-20-21, CP-23-31 (Plataforma de Pago MercadoPago)

### `tests/hu06-recepcionista.spec.ts` — 9 tests (todos activos)
Covers: CP-01, CP-08, CP-29, CP-41 through CP-46 (Gestión Recepcionista)

### `tests/hu07-login.spec.ts` — 18 tests (16 activos + 2 skip)
Tests de login, forgot-password y update-password

### `tests/hu07b-busqueda-miembro.spec.ts` — 1 test (1 activo)
Covers: HU-007 CP-01 (Protección rutas /recepcionista/clientes)

### `tests/hu08-lista-personas.spec.ts` — 1 test (1 activo)
Covers: HU-008 CP-01 (Protección rutas /recepcionista/clientes)

### `tests/rendimiento.spec.ts` — 6 tests (todos activos)
| CP | Página/API | Criterio |
|---|---|---|
| HU01-CP-40 | Landing `/` | < 3s |
| HU02-CP-23 | Sedes `/sedes` | < 3s |
| HU03-CP-24 | Membresías `/membresias` | < 3s |
| HU04-CP-35 | Registro `/register` | < 3s |
| HU05-CP-32 | API POST `/api/pagos` | < 2s |
| HU08-CP-24 | Assets CSS/JS | < 1s |

## Distribución CSV

| HU | Descripción | Total | Automatico | Manual | Rendimiento |
|---|---|---|---|---|---|
| HU-001 | Landing Page | 43 | 34 | 7 | 2 |
| HU-002 | Listado Sedes | 34 | 21 | 12 | 1 |
| HU-003 | Planes Membresía | 33 | 18 | 14 | 1 |
| HU-004 | Registro Datos | 31 | 25 | 5 | 1 |
| HU-005 | Pagos MercadoPago | 23 | 20 | 1 | 2 |
| HU-006 | Gestión Recepcionista | 46 | 9 | 37 | 0 |
| HU-007 | Búsqueda Perfil Miembro | 22 | 1 | 21 | 0 |
| HU-008 | Lista Personas | 24 | 1 | 22 | 1 |
| **Total** | | **237** | **129** | **102** | **6** |

## Notas Técnicas

- **Datos BD vacíos:** Las tablas `sedes`, `planes_membresia`, `clientes` están vacías.
- **MercadoPago:** Tests de API verifican manejo de errores. Flujos completos requieren MP_ACCESS_TOKEN real.
- **Webhooks:** El endpoint `/api/webhooks/mercadopago` responde a peticiones pero requiere firma HMAC válida.
- **Clasificación CPs:** Automatico (Playwright), Manual (humano), Rendimiento (performance).
- **hu07-login.spec.ts:** Tests de login/forgot-password, separados de HU-007 Búsqueda Perfil Miembro.
- **CPs eliminados:** 9 CPs de MercadoPago (requieren token/flujo real) removidos del CSV.
