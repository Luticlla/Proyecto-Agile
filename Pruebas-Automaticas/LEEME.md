# Pruebas Automáticas - HU-001 Landing Page

Este directorio contiene las pruebas automatizadas para la **HU-001 (Landing Page)** del proyecto Full Forma, creadas con **Playwright**.

## Requisitos

- Node.js 18+ 
- Navegador Chromium
- **Archivo `.env.local`** con las credenciales reales de Supabase en `fullfit/`
- El servidor de desarrollo de Next.js corriendo en `http://localhost:3000`

## Instalación

```bash
# 1. Desde la carpeta Pruebas-Automaticas/
cd Pruebas-Automaticas

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores de Playwright
npx playwright install chromium
```

## Cómo ejecutar

**Paso 1**: Iniciar el servidor de desarrollo (desde `fullfit/`):

```bash
cd ../fullfit
pnpm run dev
```

Asegúrate de tener tu archivo `.env.local` con las variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Paso 2**: En otra terminal, ejecutar las pruebas:

```bash
cd Pruebas-Automaticas
npm run test              # Modo headless (sin interfaz)
npm run test:headed       # Con navegador visible
npm run test:report       # Ver reporte HTML
```

## Estructura

```
Pruebas-Automaticas/
├── package.json
├── playwright.config.ts
├── LEEME.md
├── HU01-CORRECCIONES-CSV.md
├── tests/
│   └── hu01-landing-page.spec.ts   # 31 pruebas automáticas
```

## Nota importante sobre Supabase

El proyecto **requiere** credenciales reales de Supabase en `.env.local` para funcionar. Sin ellas, el middleware de autenticación (`proxy.ts`) lanza un error y la aplicación no carga. Las pruebas de HU-001 no necesitan datos en Supabase para ejecutarse, pero el servidor Next.js sí necesita las variables para arrancar.
