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
pnpm install
```

## Ejecución

```bash
# Todas las pruebas
pnpm test

# Archivo específico
pnpm test -- tests/hu01-landing-page.spec.ts

# Modo UI interactivo
pnpm test:ui
```

## Estructura

```
Pruebas-Automaticas/
  package.json
  playwright.config.ts
  LEEME.md
  HU01-CORRECCIONES-CSV.md
  HU02-CORRECCIONES-CSV.md
  HU03-CORRECCIONES-CSV.md
  HU04-CORRECCIONES-CSV.md
  HU05-CORRECCIONES-CSV.md
  HU06-CORRECCIONES-CSV.md
  tests/
    hu01-landing-page.spec.ts
    hu02-sedes.spec.ts
    hu03-membresias.spec.ts
    hu04-register.spec.ts
    hu05-pagos.spec.ts
    hu06-recepcionista.spec.ts
```

## Casos de Prueba

| HU | Descripción | Tests | Pasaron | Fallaron | Omitidos |
|---|---|---|---|---|---|---|
| HU-001 | Landing Page | 16 | 16 | 0 | 0 |
| HU-002 | Sedes | 8 | 8 | 0 | 0 |
| HU-003 | Membresías | 15 | 15 | 0 | 0 |
| HU-004 | Registro de Usuario | 14 | 14 | 0 | 0 |
| HU-005 | Pasarela de Pagos | 6 | 5 | 0 | 1 |
| HU-006 | Recepcionista | 6 | 1 | 0 | 5 |
| **Total** | | **65** | **59** | **0** | **6** |

## Notas

- Los tests de HU-005 (Pagos) que requieren Mercado Pago real quedan como Manuales.
- Los tests de HU-006 (Recepcionista) requieren sesión de Supabase. CP-41 (redirect sin auth) siempre funciona; el resto salta si no hay sesión.
- Los archivos `HU*-CORRECCIONES-CSV.md` documentan diferencias entre el CSV original y la implementación real.
