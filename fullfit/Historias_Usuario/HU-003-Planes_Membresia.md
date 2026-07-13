# HU-003: Planes de Membresía

## Historia de Usuario
**Como** Socio (visitante),
**Quiero** ver los planes de membresía disponibles,
**Para** elegir el plan que mejor se ajuste a mis necesidades y presupuesto.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Estructura General de la Página

- [x] La página utiliza el mismo layout que las demás páginas: Barra de navegación → Contenido → Pie de página
- [x] El fondo de toda la página es negro
- [x] La página se divide en tres secciones: Encabezado superior, Listado de planes, Sección de ayuda

---

### 2. Encabezado de la Página

**Fondo decorativo:**
- [x] Se muestra un patrón de cuadrícula sutil en el fondo (líneas horizontales y verticales muy tenues en color amarillo)
- [x] El patrón tiene baja opacidad para no distraer del contenido principal
- [x] Línea decorativa amarilla en la parte inferior del encabezado

**Etiqueta superior:**
- [x] Texto "Planes" en color amarillo, fuente arcade, tamaño pequeño
- [x] Dos líneas decorativas amarillas a cada lado del texto (una a la izquierda, otra a la derecha)

**Título principal:**
- [x] Texto: "Elige tu **Membresía**"
- [x] "Elige tu" en color blanco
- [x] "Membresía" en color amarillo con efecto de brillo/sombra luminosa
- [x] Fuente arcade, tamaño grande, mayúsculas

**Subtítulo:**
- [x] Texto: "Entrena sin límites en cualquiera de nuestras sedes. **Sin contratos largos, cancela cuando quieras.**"
- [x] La primera parte en blanco con opacidad reducida
- [x] "Sin contratos largos, cancela cuando quieras" en amarillo con opacidad reducida
- [x] Fuente monoespaciada, tamaño pequeño

**Barra de estadísticas:**
- [x] Separada del contenido por una línea horizontal tenue
- [x] Dos estadísticas centradas:
  - **Número de planes**: muestra la cantidad real de planes activos consultados desde la base de datos, en color amarillo, fuente arcade
  - **100% Flexible**: texto fijo en color amarillo, fuente arcade
- [x] Línea vertical separadora entre ambas estadísticas
- [x] Etiquetas debajo de cada número en blanco con baja opacidad, fuente arcade, tamaño muy pequeño

---

### 3. Listado de Planes

**Tarjeta de cada plan:**
- [x] Fondo blanco con baja opacidad (casi transparente)
- [x] Borde sutil que se intensifica al pasar el mouse
- [x] Bordes redondeados
- [x] Efecto de elevación (sombra) al pasar el mouse
- [x] Transición suave de escala al pasar el mouse (efecto de zoom ligero)
- [x] Layout vertical: nombre arriba, precio al medio, beneficios abajo, botón al final

**Plan "Trimestral" (diferenciado):**
- [x] Borde amarillo en lugar de borde blanco
- [x] Fondo amarillo muy tenue
- [x] Badge "Más Popular" posicionado arriba del centro de la tarjeta
  - Fondo amarillo, texto negro, fuente arcade, tamaño pequeño
  - Bordes redondeados

**Información del plan:**
- [x] **Nombre**: fuente arcade, color blanco, mayúsculas, tamaño mediano-grande
- [x] **Descripción** (si existe): texto blanco con opacidad reducida, fuente monoespaciada, tamaño pequeño
- [x] **Indicador de membresía activa**: si el usuario tiene una membresía activa y no puede comprar, se muestra un texto indicando cuántos días faltan para renovar, en color amarillo tenue

**Precio:**
- [x] **Precio total**: en color amarillo, fuente arcade, tamaño grande (ejemplo: "S/ 150")
- [x] **Precio por mes**: en blanco con opacidad reducida, fuente monoespaciada, tamaño pequeño (ejemplo: "S/ 50/mes")
- [x] Para el plan anual: muestra "al año" en lugar de precio por mes
- [x] El cálculo del precio por mes se realiza dividiendo el precio total entre los días del plan divididos en 30

**Lista de beneficios:**
- [x] Cada beneficio tiene un ícono de check (✓) en color amarillo
- [x] Texto del beneficio en blanco con opacidad reducida, fuente monoespaciada
- [x] Los beneficios varían según el plan:
  - **Mensual**: Acceso a todas las sedes, Área de pesas y máquinas, Vestuarios y locker, App de seguimiento
  - **Trimestral**: todos los anteriores + Clases grupales ilimitadas, Evaluación corporal mensual
  - **Anual**: todos los anteriores + Hasta 2 suspensiones temporales (Freeze), Acceso prioritario a eventos

**Botón "Elegir Plan":**
- [x] Botón completo que ocupa todo el ancho de la tarjeta
- [x] **Plan popular (Trimestral)**: fondo amarillo, texto negro, fuente arcade, mayúsculas
- [x] **Otros planes**: fondo blanco con baja opacidad, texto blanco, borde sutil
- [x] Al pasar el mouse: cambio de tono de color

**Estado de carga:**
- [x] Mientras se verifica si el usuario tiene membresía activa, el botón muestra un ícono giratorio y texto "Verificando..."

**Estado bloqueado:**
- [x] Si el usuario ya tiene una membresía activa, el botón se deshabilita
- [x] Muestra ícono de candado y texto "Membresía activa"
- [x] Color gris sin interacción

**Diseño responsivo:**
- [x] En móvil: tarjetas apiladas verticalmente, una debajo de otra
- [x] En tablet/computadora: tres tarjetas lado a lado

---

### 4. Sección de Ayuda

**Estilo de la sección:**
- [x] Separada del contenido por una línea horizontal muy tenue
- [x] Padding vertical para dar espacio

**Contenido:**
- [x] Texto: "¿Tienes dudas sobre qué plan elegir? Visítanos en cualquiera de nuestras sedes"
- [x] Color blanco con opacidad reducida, fuente monoespaciada
- [x] "Visítanos en cualquiera de nuestras sedes" es un enlace que lleva a la página de sedes
- [x] El enlace tiene color amarillo y subrayado al pasar el mouse

---

### 5. Flujo de Selección de Plan

**Si el usuario NO ha iniciado sesión:**
- [x] Al hacer clic en "Elegir Plan", redirige a la página de login
- [x] Después de iniciar sesión, redirige automáticamente a la página de pago con el plan seleccionado

**Si el usuario SÍ ha iniciado sesión:**
- [x] Al hacer clic en "Elegir Plan", lleva directamente a la página de pago
- [x] La página de pago muestra un resumen del plan seleccionado

**Si el usuario tiene membresía activa:**
- [x] No puede seleccionar un nuevo plan
- [x] El botón se muestra deshabilitado con mensaje de "Membresía activa"

---

### 6. Datos de la Base de Datos

- [x] La página consulta solo los planes con estado activo
- [x] Los planes se muestran ordenados por duración (de menor a mayor)
- [x] Cada plan contiene: id, nombre, descripción, precio, duración en días, estado

---

### 7. Estilo General

- [x] **Fondo**: negro en toda la página
- [x] **Color de acento**: amarillo para títulos, precios, iconos de beneficios, borde del plan popular y botón popular
- [x] **Fuentes**: arcade para títulos y elementos destacados, monoespaciada para descripciones y precios
- [x] **Transiciones**: efectos suaves al pasar el mouse en tarjetas, botones y enlaces
- [x] **Diseño responsivo**: la página se adapta desde móviles hasta pantallas grandes
