# HU-001: Página Principal del Sitio

## Historia de Usuario
**Como** Socio (visitante),
**Quiero** acceder a la página web oficial del gimnasio,
**Para** conocer la propuesta de valor, ver los resultados de otros miembros y decidirme a comprar una membresía.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Estructura General de la Página

- [x] La página se compone de tres partes apiladas verticalmente: Barra de navegación superior → Contenido principal → Pie de página
- [x] La página ocupa toda la altura disponible de la pantalla
- [x] El contenido principal se expande para empujar el pie de página al fondo
- [x] El fondo de toda la página es negro
- [x] Se utiliza una fuente estilo "arcade" (Press Start 2P) para títulos, menús y elementos destacados
- [x] Se utiliza una fuente monoespaciada (JetBrains Mono) para el cuerpo de texto

---

### 2. Barra de Navegación Superior (Header)

**Estructura:**
- [x] Fondo negro con una línea decorativa amarilla en la parte inferior
- [x] Tendrá un espaciado definido en altura para mantener consistencia visual
- [x] Contenido alineado horizontalmente: Logo a la izquierda, menú de navegación al centro-derecha, botón de menú móvil a la derecha

**Logo:**
- [x] Texto "FULLFORMA" que enlaza al inicio
- [x] "FULL" en color amarillo, "FORMA" en color blanco
- [x] Al pasar el mouse, los colores se invierten ("FULL" pasa a blanco, "FORMA" pasa a amarillo)
- [x] Fuente estilo arcade, en mayúsculas

**Menú de Escritorio (pantallas grandes):**
- [x] Visible solo en computadoras (pantallas grandes), oculto en tablets y móviles
- [x] Muestra dos enlaces de navegación: "Sedes" y "Membresías"
- [x] "Sedes" lleva a la página de sedes
- [x] "Membresías" lleva a la página de membresías
- [x] Color blanco, al pasar el mouse cambia a amarillo
- [x] Cuando el usuario está en esa página, el enlace se muestra en amarillo
- [x] Efecto decorativo: una línea amarilla aparece debajo del enlace al pasar el mouse, creciendo desde el centro hacia los extremos
- [x] Después de los enlaces, se muestran los botones de autenticación

**Botones de Autenticación (estado sin sesión):**
- [x] Dos botones aparecen cuando el usuario NO ha iniciado sesión:
  - "Iniciar Sesión" → lleva a la página de login, estilo borde transparente
  - "¡Regístrate!" → lleva a la página de registro, fondo amarillo, texto oscuro
- [x] Ambos botones usan fuente arcade

**Botones de Autenticación (estado con sesión):**
- [x] Cuando el usuario SÍ ha iniciado sesión, se muestra:
  - Icono de persona + nombre del usuario (o correo electrónico si no tiene nombre)
  - Botón "Salir" con icono de flecha de salida
- [x] El botón "Salir" tiene borde transparente, al pasar el mouse cambia a amarillo

**Indicador de Carga:**
- [x] Mientras se verifica si hay sesión activa, se muestra un ícono giratorio amarillo

**Menú Móvil (pantallas pequeñas):**
- [x] Visible solo en tablets y móviles, oculto en computadoras
- [x] Botón de tres líneas (hamburguesa) en color blanco
- [x] Al tocarlo, se abre un panel lateral desde la derecha

**Panel Lateral Móvil (SideMenu):**
- [x] Fondo oscuro semitransparente cubre toda la pantalla
- [x] Panel deslizante desde la derecha con fondo gris oscuro
- [x] Botón "X" (cerrar) en la esquina superior derecha, al pasar el mouse cambia a amarillo
- [x] Mismos enlaces de navegación que el menú de escritorio: "Sedes" y "Membresías"
- [x] Los botones de autenticación aparecen apilados verticalmente debajo de los enlaces
- [x] En la parte inferior: iconos de redes sociales + logo
- [x] Se cierra automáticamente al tocar fuera del panel
- [x] Animación suave de deslizamiento al abrir y cerrar

---

### 3. Contenido Principal (Cuerpo de la Página)

**Sección Banner Principal:**
- [x] Imagen de banner que ocupa la mayor parte de la pantalla
- [x] Altura responsiva: más corta en móvil, más alta en tablet, se ajusta en computadora
- [x] Imagen con bordes redondeados
- [x] Sombra sutil que le da profundidad
- [x] Botón "¡Inscríbete ya!" posicionado en la esquina superior derecha del banner
  - Fondo rojo, al pasar el mouse cambia a amarillo
  - Texto blanco en fuente arcade, mayúsculas
  - Tamaño del botón se adapta al dispositivo (más pequeño en móvil, más grande en computadora)
  - Enlaza a la página de sedes

**Sección de Título:**
- [x] Texto centrado: "Encuentra tu mejor **versión** con nosotros"
- [x] "versión" resaltado en color blanco, el resto del texto en amarillo
- [x] Fuente arcade
- [x] Tamaño de texto se adapta al dispositivo (más pequeño en móvil, más grande en computadora)

**Sección de Galería Antes/Después:**
- [x] Carrusel de imágenes que se desplaza automáticamente en loop infinito
- [x] Muestra 4 pares de imágenes: cada par tiene una foto "ANTES" y una foto "DESPUÉS"
- [x] Las imágenes se duplican para lograr el efecto de scroll continuo
- [x] Cada imagen tiene bordes redondeados y sombra
- [x] Etiqueta "ANTES" en la esquina inferior izquierda de cada imagen "antes": fondo negro semitransparente, texto blanco
- [x] Etiqueta "DESPUÉS" en la esquina inferior izquierda de cada imagen "después": fondo amarillo semitransparente, texto negro
- [x] Los bordes izquierdo y derecho de la sección se desvanecen gradualmente (efecto de degradado) para dar sensación de continuidad
- [x] Ancho máximo de 1200 píxeles, centrada en la página

---

### 4. Pie de Página (Footer)

**Estructura:**
- [x] Fondo negro con una línea decorativa blanca semitransparente en la parte superior
- [x] Margen superior para separarse del contenido
- [x] Contenido centrado verticalmente con espacio entre secciones

**Sección Redes Sociales:**
- [x] Título: "Nuestras **Redes**" — "Nuestras" en blanco, "Redes" en amarillo
- [x] Fuente arcade, mayúsculas
- [x] Dos iconos circulares con borde:
  - Facebook → enlace externo (se abre en nueva pestaña)
  - Instagram → enlace externo (se abre en nueva pestaña)
- [x] Los iconos son blancos con borde blanco semitransparente
- [x] Al pasar el mouse: fondo amarillo, texto negro, borde amarillo
- [x] Al pasar el mouse sobre cada icono aparece un tooltip con el nombre de la red social

**Línea Divisoria:**
- [x] Línea horizontal fina que separa las redes sociales del logo

**Logo:**
- [x] Mismo logo "FULLFORMA" del header, centrado, tamaño mediano

**Copyright:**
- [x] Texto: "© [año actual] Full Forma. Todos los derechos reservados."
- [x] El año se muestra automáticamente según la fecha actual
- [x] Fuente arcade, color blanco con opacidad baja (apenas visible), texto centrado

---

### 5. Estilo General

- [x] **Tema oscuro**: toda la página tiene fondo negro
- [x] **Color de acento**: amarillo (#ffdf00) para elementos destacados, enlaces activos, hover y botones principales
- [x] **Fuentes**: estilo arcade para títulos y navegación, monoespaciada para cuerpo
- [x] **Transiciones**: todos los elementos interactivos tienen cambio suave de color al pasar el mouse
- [x] **Diseño responsivo**: la página se adapta desde móviles hasta pantallas grandes, ajustando tamaños, espacios y visibilidad de elementos según el dispositivo

---

## Archivos Relacionados
- `app/(marketing)/layout.tsx` — Layout principal (Header + Main + Footer)
- `app/(marketing)/page.tsx` — Página Home
- `components/layout/Header.tsx` — Barra de navegación
- `components/layout/Footer.tsx` — Pie de página
- `components/layout/Container.tsx` — Contenedor centrado
- `components/shared/Logo.tsx` — Logo "FULLFORMA"
- `components/shared/AuthButtons.tsx` — Botones de autenticación
- `components/shared/SocialMedia.tsx` — Iconos de redes sociales
- `components/navigation/HeaderMenu.tsx` — Menú de escritorio
- `components/navigation/MobileMenu.tsx` — Botón hamburguesa
- `components/navigation/SideMenu.tsx` — Menú lateral móvil
- `components/sections/HomeBanner.tsx` — Banner principal
- `components/sections/InfiniteScroll.tsx` — Carrusel antes/después
- `constants/navigation.ts` — Datos de navegación (headerData, footerLinks)
- `constants/social.ts` — Enlaces de redes sociales
