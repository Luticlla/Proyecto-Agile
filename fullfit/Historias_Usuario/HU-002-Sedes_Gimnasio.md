# HU-002: Sedes del Gimnasio

## Historia de Usuario
**Como** Socio (visitante),
**Quiero** ver el listado de sedes del gimnasio,
**Para** inscribirme en la más cercana a mi ubicación.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Estructura General de la Página

- [x] La página utiliza el mismo layout que la página principal: Barra de navegación → Contenido → Pie de página
- [x] El fondo de toda la página es negro
- [x] La página se divide en tres secciones: Encabezado superior, Listado de sedes, Sección de llamada a la acción

---

### 2. Encabezado de la Página

**Fondo decorativo:**
- [x] Se muestra un patrón de cuadrícula sutil en el fondo (líneas horizontales y verticales muy tenues en color amarillo)
- [x] El patrón tiene baja opacidad para no distraer del contenido principal
- [x] Línea decorativa amarilla en la parte inferior del encabezado

**Etiqueta superior:**
- [x] Texto "Encuéntranos" en color amarillo, fuente arcade, tamaño pequeño
- [x] Dos líneas decorativas amarillas a cada lado del texto (una a la izquierda, otra a la derecha)

**Título principal:**
- [x] Texto: "Nuestras **Sedes**"
- [x] "Nuestras" en color blanco
- [x] "Sedes" en color amarillo con efecto de brillo/sombra luminosa
- [x] Fuente arcade, tamaño grande, mayúsculas

**Subtítulo:**
- [x] Texto: "Múltiples puntos de entrenamiento en Trujillo. **Tu membresía, todas las sedes.**"
- [x] La primera parte en blanco con opacidad reducida
- [x] "Tu membresía, todas las sedes" en amarillo con opacidad reducida
- [x] Fuente monoespaciada, tamaño pequeño

**Barra de estadísticas:**
- [x] Separada del contenido por una línea horizontal tenue
- [x] Dos estadísticas centradas:
  - **Número de sedes**: muestra la cantidad real de sedes activas consultadas desde la base de datos, en color amarillo, fuente arcade
  - **24/7 Soporte**: texto fijo en color amarillo, fuente arcade
- [x] Línea vertical separadora entre ambas estadísticas
- [x] Etiquetas debajo de cada número en blanco con baja opacidad, fuente arcade, tamaño muy pequeño

---

### 3. Listado de Sedes

**Tarjeta de cada sede:**
- [x] Borde sutil que se intensifica al pasar el mouse
- [x] Fondo negro semitransparente
- [x] Transición suave de color al pasar el mouse

**Imagen de la sede:**
- [x] Si la sede tiene imagen: se muestra cubriendo toda la parte superior de la tarjeta
- [x] La imagen tiene opacidad reducida que aumenta al pasar el mouse
- [x] Efecto de zoom suave al pasar el mouse sobre la imagen
- [x] Degradado de negro hacia transparente en la parte inferior de la imagen (para mezclar con el contenido)
- [x] Si la sede NO tiene imagen: se muestra un ícono de pesa (Dumbbell) en color amarillo tenue sobre fondo gris oscuro

**Información de la sede:**
- [x] **Nombre**: fuente arcade, color blanco, mayúsculas, tamaño mediano
- [x] **Dirección**: ícono de pin de mapa amarillo + texto de la dirección en blanco con opacidad reducida, fuente monoespaciada
- [x] **Teléfono**: ícono de teléfono amarillo + número de teléfono como enlace clicable (al hacer clic marca el número)
  - Color blanco con opacidad reducida, al pasar el mouse cambia a amarillo
- [x] **Horario**: ícono de reloj amarillo + texto "Lun–Vie:" seguido del horario de apertura y cierre
  - Horarios en formato 12 horas (ejemplo: "8:00 am – 10:00 pm")

**Panel de horarios detallados:**
- [x] Botón "Ver más información" con ícono de flecha hacia abajo
- [x] Al hacer clic se expande un panel con animación suave
- [x] El botón cambia a "Ver menos" y la flecha se rotá hacia arriba
- [x] El panel expandido muestra:
  - Título "Horarios" en amarillo, fuente arcade
  - **Lun – Vie**: horario de apertura y cierre
  - **Sábado**: horario de apertura y cierre
  - **Domingo**: texto "Cerrado" en color rojo

**Botón "Cómo llegar":**
- [x] Solo se muestra si la sede tiene coordenadas de ubicación (latitud y longitud)
- [x] Botón completo con ícono de pin de mapa
- [x] Texto "Cómo llegar" en fuente arcade, mayúsculas
- [x] Borde blanco semitransparente, al pasar el mouse cambia a amarillo
- [x] Al hacer clic abre Google Maps en una nueva pestaña con la ubicación de la sede

**Estado vacío (sin sedes):**
- [x] Si no hay sedes activas en la base de datos, se muestra:
  - Ícono de pesa grande en color amarillo muy tenue
  - Texto: "No hay sedes disponibles en este momento"
  - Fuente arcade, color blanco con baja opacidad

**Diseño responsivo:**
- [x] Las tarjetas se adaptan al tamaño de pantalla
- [x] En móvil: tarjetas apiladas verticalmente, una debajo de otra
- [x] En tablet: dos tarjetas lado a lado
- [x] En computadora: hasta tres tarjetas lado a lado

---

### 4. Sección de Llamada a la Acción (CTA)

**Estilo de la sección:**
- [x] Línea decorativa amarilla tenue en la parte superior
- [x] Fondo amarillo muy tenue (casi transparente)
- [x] Padding vertical amplio para separar del contenido

**Contenido:**
- [x] **Texto superior**: "¿Aún no eres miembro?" en color amarillo, fuente arcade, mayúsculas
- [x] **Texto principal**: "Una membresía, **todas las sedes**" en color blanco, fuente arcade
  - "todas las sedes" resaltado en amarillo
- [x] **Botón**: "Ver Membresías" en color amarillo, texto negro, fuente arcade, mayúsculas
  - Al pasar el mouse: cambio de tono de amarillo
  - Enlaza a la página de membresías

**Diseño responsivo:**
- [x] En móvil: texto centrado, botón debajo del texto
- [x] En computadora: texto a la izquierda, botón a la derecha (alineados horizontalmente)

---

### 5. Datos de la Base de Datos

- [x] La página consulta solo las sedes con estado "activa"
- [x] Las sedes se muestran ordenadas alfabéticamente por nombre
- [x] Cada sede contiene: nombre, dirección, teléfono, email, imagen, coordenadas (latitud/longitud), horarios de apertura y cierre (días laborables y sábado), estado

---

### 6. Estilo General

- [x] **Fondo**: negro en toda la página
- [x] **Color de acento**: amarillo para títulos, iconos, bordes decorativos y elementos interactivos
- [x] **Fuentes**: arcade para títulos y elementos destacados, monoespaciada para información detallada
- [x] **Transiciones**: efectos suaves al pasar el mouse en tarjetas, enlaces, botones e imágenes
- [x] **Diseño responsivo**: la página se adapta desde móviles hasta pantallas grandes
