# Pruebas Automáticas - FullFit

Suite de pruebas E2E con Playwright para el proyecto FullFit.

## Requisitos

- Node.js 20+
- pnpm
- Servidor Next.js corriendo en `http://localhost:3000`
- Archivo `.env.local` en `fullfit/` con credenciales de Supabase

## Instalación

```bash
cd Pruebas-Automaticas
pnpm install --ignore-workspace
pnpm exec playwright install chromium
```

## Ejecución

```bash
# Todas las pruebas
pnpm test

# Archivo específico
pnpm test -- tests/hu01-landing-page.spec.ts

# Solo rendimiento
pnpm test -- tests/rendimiento.spec.ts

# Modo UI interactivo
pnpm test:ui
```

## Estructura

```
Pruebas-Automaticas/
  package.json
  playwright.config.ts
  LEEME.md
  CASOS-DE-PRUEBA-FINAL.csv
  DOCUMENTACION-TESTS.md
  tests/
    hu01-landing-page.spec.ts
    hu02-sedes.spec.ts
    hu03-membresias.spec.ts
    hu04-register.spec.ts
    hu05-pagos.spec.ts
    hu06-recepcionista.spec.ts
    hu07-login.spec.ts
    hu07b-busqueda-miembro.spec.ts
    hu08-lista-personas.spec.ts
    rendimiento.spec.ts
    helpers/
      auth.ts
```

## Casos de Prueba

| HU | Descripción | CSV Total | Automatico | Tests | Pass | Skip |
|---|---|---|---|---|---|---|
| HU-001 | Landing Page | 43 | 34 | 34 | 34 | 0 |
| HU-002 | Listado Sedes | 34 | 21 | 21 | 21 | 0 |
| HU-003 | Planes Membresía | 33 | 18 | 18 | 18 | 0 |
| HU-004 | Registro Datos | 31 | 25 | 25 | 25 | 0 |
| HU-005 | Pagos MercadoPago | 23 | 20 | 20 | 13 | 7 |
| HU-006 | Gestión Recepcionista | 46 | 9 | 9 | 9 | 0 |
| HU-007 | Búsqueda Perfil | 22 | 1 | 1 | 1 | 0 |
| HU-008 | Lista Personas | 24 | 1 | 1 | 1 | 0 |
| Login | Login/Auth | — | — | 18 | 16 | 2 |
| Rendimiento | Performance | 6 | 6 | 6 | 6 | 0 |
| **Total** | | **237** | **129** | **153** | **116** | **35** |

## Clasificación de CPs

- **Automatico (129):** Implementados como tests Playwright
- **Manual (102):** Requieren intervención humana
- **Rendimiento (6):** Tests de performance en `rendimiento.spec.ts` (pages < 3s, APIs < 2s, assets < 1s)

## Notas

- **Datos BD vacíos:** Las tablas `sedes`, `planes_membresia`, `clientes` están vacías.
- **MercadoPago:** Tests de API verifican manejo de errores. Flujos completos requieren MP_ACCESS_TOKEN real.
- **Webhooks:** El endpoint `/api/webhooks/mercadopago` responde pero requiere firma HMAC válida.
- **hu07-login.spec.ts:** Tests de login/forgot-password, separados de HU-007 Búsqueda Perfil Miembro.
- **CSV:** `CASOS-DE-PRUEBA-FINAL.csv` contiene 237 CPs con clasificación Automatico/Manual/Rendimiento.
