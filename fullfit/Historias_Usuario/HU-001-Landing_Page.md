# HU-001: Landing Page Informativa

## Historia de Usuario
**Como** Socio (visitante),
**Quiero** acceder a la página web oficial del gimnasio,
**Para** conocer la propuesta de valor, ver los resultados de otros miembros y decidirme a comprar una membresía.

## Estado
✅ Implementada

## Criterios de Aceptación

### 1. Página Principal
- [x] Al visitar `/`, se muestra un banner principal con imagen `/images/banner-home.png`
- [x] El banner tiene un botón "¡Inscríbete ya!" que enlaza a `/sedes`
- [x] Se muestra una sección heading: "Encuentra tu mejor versión con nosotros"
- [x] Se renderiza componente InfiniteScroll con pares de imágenes "ANTES/DESPUÉS" en animación infinita

### 2. Navegación (Header)
- [x] Header con Logo, navegación (Sedes, Membresías) y botones de auth
- [x] En móvil (< lg), se muestra menú hamburguesa (hamburger-react) con SideMenu lateral
- [x] Si no ha iniciado sesión: botones "Iniciar Sesión" y "¡Regístrate!"
- [x] Si ha iniciado sesión: nombre de usuario y botón "Salir"

### 3. Footer
- [x] Redes sociales: Facebook e Instagram (enlaces configurados en constants/navigation.ts)
- [x] Logo centrado
- [x] Copyright con año actual

### 4. Estilo
- [x] Fondo negro, color de acento amarillo (#ffdf00)
- [x] Fuentes: JetBrains Mono, Press Start 2P (fuente arcade)

## Archivos Relacionados
- `app/(marketing)/page.tsx`
- `components/sections/HomeBanner.tsx`
- `components/sections/InfiniteScroll.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/navigation/HeaderMenu.tsx`
- `components/navigation/MobileMenu.tsx`
- `components/navigation/SideMenu.tsx`
- `constants/navigation.ts`
