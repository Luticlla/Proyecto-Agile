# HU-013: Mi Membresía (Vista del Socio)

## Historia de Usuario
**Como** Socio (miembro),
**Quiero** ver el estado de mi membresía y los días restantes,
**Para** conocer cuánto tiempo me queda de acceso y motivarme a renovar o adquirir una membresía si no tengo una.

## Estado
🔴 No implementada — No existe sección dedicada para que los socios vean su membresía actual. Los miembros son redirigidos a la página principal después del login.

---

## Criterios de Aceptación

### 1. Acceso y Permisos

- [ ] Solo usuarios con rol de miembro (rol_id = 3) pueden acceder
- [ ] Si no está autenticado, redirige al login
- [ ] Si no es miembro (es recepcionista o gerente), redirige a su área correspondiente
- [ ] Ruta: `/mi-membresia`
- [ ] El proxy debe ser actualizado para proteger esta ruta

---

### 2. Layout y Navegación

- [ ] Layout propio para la sección de miembros (similar al del recepcionista)
- [ ] Header con:
  - [ ] Logo "FullFit" a la izquierda
  - [ ] Nombre del socio a la derecha
  - [ ] Botón "Cerrar Sesión"
- [ ] Fondo oscuro consistente (zinc-950)

---

### 3. Estado de Membresía — Socio CON membresía activa

- [ ] Tarjeta principal con fondo degradado (oscuro a verde tenue)
- [ ] Título: "Tu Membresía"
- [ ] Badge de estado "Activa" (verde)
- [ ] Información del plan:
  - [ ] Nombre del plan (Mensual, Trimestral, Anual)
  - [ ] Fecha de inicio (formato DD/MM/YYYY)
  - [ ] Fecha de vencimiento (formato DD/MM/YYYY)
- [ ] Contador de días restantes:
  - [ ] Número grande y destacado
  - [ ] Texto: "días restantes"
  - [ ] Color según urgencia:
    - [ ] Más de 30 días: verde
    - [ ] 16-30 días: amarillo claro
    - [ ] 8-15 días: amarillo
    - [ ] 1-7 días: rojo (con animación sutil de pulso)
    - [ ] Hoy: rojo intenso con "Vence hoy"
- [ ] Barra de progreso visual:
  - [ ] Muestra porcentaje de tiempo transcurrido
  - [ ] Color cambia según días restantes
  - [ ] Animación suave al cargar
- [ ] Botón "Renovar Membresía" (solo si vence en 7 días o menos)
  - [ ] Estilo amarillo llamativo
  - [ ] Enlaza a `/pasarelapago?plan={id_plan_actual}`

---

### 4. Estado de Membresía — Socio con membresía VENCIDA

- [ ] Tarjeta principal con fondo degradado (oscuro a rojo tenue)
- [ ] Título: "Tu Membresía"
- [ ] Badge de estado "Vencida" (rojo)
- [ ] Información del plan anterior:
  - [ ] Nombre del plan que tenía
  - [ ] Fecha de vencimiento (resaltada en rojo)
- [ ] Mensaje: "Tu membresía venció hace X días"
- [ ] Barra de progreso completa en rojo
- [ ] Botón "Renovar Ahora" (rojo/amarillo llamativo)
  - [ ] Enlaza a `/pasarelapago?plan={id_plan_actual}`

---

### 5. Estado de Membresía — Socio SIN membresía

- [ ] Tarjeta principal con fondo oscuro elegante
- [ ] Título: "¡Bienvenido a FullFit!"
- [ ] Subtítulo: "Activa tu membresía y comienza tu transformación"
- [ ] Grid de planes disponibles (desde BD):
  - [ ] Tarjeta para cada plan activo:
    - [ ] Nombre del plan
    - [ ] Precio total (S/)
    - [ ] Precio por mes (calculado)
    - [ ] Lista de beneficios/features del plan
    - [ ] Badge "Más Popular" para el plan más elegido
    - [ ] Botón "Elegir Plan" (amarillo)
  - [ ] Efecto hover en cada tarjeta
  - [ ] Responsive: 1 columna en móvil, 3 en desktop
- [ ] Sección de beneficios generales:
  - [ ] Íconos con texto: "Acceso a todas las sedes"
  - [ ] Íconos con texto: "Área de pesas y máquinas"
  - [ ] Íconos con texto: "Clases grupales ilimitadas"
  - [ ] Íconos con texto: "App de seguimiento"

---

### 6. Historial de Membresías (en la misma página)

- [ ] Tarjeta "Historial de Membresías" debajo de la tarjeta principal
- [ ] Lista de las últimas 3-5 membresías del socio:
  - [ ] Plan
  - [ ] Período (inicio - fin)
  - [ ] Estado (Activa, Vencida, Cancelada)
- [ ] Si no tiene historial: "No hay membresías registradas"
- [ ] Se carga automáticamente con la membresía actual

---

### 7. Información de Contacto

- [ ] Tarjeta "¿Necesitas ayuda?"
- [ ] Teléfono del gimnasio
- [ ] Email de contacto
- [ ] Horarios de atención

---

### 8. Estados de Carga

- [ ] Spinner de carga mientras se obtiene la membresía
- [ ] Skeleton loading para la tarjeta principal
- [ ] Skeleton loading para la lista de planes (si no tiene membresía)
- [ ] Mensaje "Cargando tu información..."

---

### 9. Manejo de Errores

- [ ] Si no se puede cargar la membresía: mensaje de error con botón "Reintentar"
- [ ] Si el usuario no existe: redirigir al login
- [ ] Si hay error de conexión: mensaje amigable
- [ ] Si no hay planes disponibles: "Próximamente tendremos nuevos planes"

---

### 10. Diseño y Estilo

**Tema visual:**
- [ ] Fondo oscuro (zinc-950) consistente con el resto de la app
- [ ] Tarjetas con bordes sutiles (zinc-800)
- [ ] Color de acento: amarillo (#ffdf00)
- [ ] Badges de estado con colores consistentes (verde, rojo, amarillo, gris)
- [ ] Fuentes: estilo arcade para títulos, monoespaciada para contenido

**Efectos visuales:**
- [ ] Animación suave al cargar la página
- [ ] Hover en botones y tarjetas de planes
- [ ] Transiciones de color en badges
- [ ] Barra de progreso con animación
- [ ] Efecto de pulso en días restantes bajos (1-7 días)

**Responsive:**
- [ ] Mobile-first
- [ ] Tablet: ajuste de columnas
- [ ] Desktop: layout completo

---

### 11. Base de Datos (Consultas Necesarias)

**Query: Obtener membresía activa del usuario**
- [ ] Parámetro: usuario_id
- [ ] Retorna: plan (nombre, precio, duración), fecha_inicio, fecha_fin, estado
- [ ] Filtra por estado = 'activa'
- [ ] Ordena por fecha_fin descendente

**Query: Obtener historial de membresías**
- [ ] Parámetro: usuario_id
- [ ] Retorna: lista de membresías (máximo 5)
- [ ] Incluye: plan, fechas, estado
- [ ] Ordena por fecha_inicio descendente

---

### 12. API Routes

**GET /api/mi-membresia**
- [ ] Retorna la membresía activa del usuario autenticado
- [ ] Si no tiene membresía activa, retorna null
- [ ] Incluye datos del plan (nombre, precio, duración)
- [ ] Requiere autenticación

**GET /api/mi-membresia/historial**
- [ ] Retorna las últimas 5 membresías del usuario
- [ ] Incluye estado de cada una
- [ ] Requiere autenticación

---

### 13. Seguridad

- [ ] Solo usuarios con rol de miembro pueden acceder
- [ ] Las API requieren autenticación
- [ ] Cada usuario solo puede ver sus propias membresías
- [ ] Las queries filtran por usuario_id del token JWT

---

### 14. Integración con Fluxo Existente

**Desde la Página Pública:**
- [ ] Si el miembro está logueado y visita `/membresias`, mostrar botón "Ver mi membresía"
- [ ] O redirigir automáticamente a `/mi-membresia`

**Renovación:**
- [ ] Botón "Renovar" redirige a `/pasarelapago?plan={id}`
- [ ] Después del pago, actualizar la vista automáticamente
- [ ] Mostrar confirmación de renovación exitosa

---

### 15. Copywriting (Textos de la Interfaz)

**Títulos:**
- [ ] "Tu Membresía" (con membresía o vencida)
- [ ] "¡Bienvenido a FullFit!" (sin membresía)

**Mensajes de urgencia:**
- [ ] "Te quedan X días" (>7 días)
- [ ] "¡Te quedan solo X días!" (1-7 días)
- [ ] "Tu membresía vence hoy" (0 días)
- [ ] "Tu membresía venció hace X días" (vencida)

**Call to Action:**
- [ ] "Renovar Membresía" (activas por vencer)
- [ ] "Renovar Ahora" (vencidas)
- [ ] "Elegir Plan" (sin membresía)

**Beneficios:**
- [ ] "Acceso a todas las sedes"
- [ ] "Área de pesas y máquinas"
- [ ] "Clases grupales ilimitadas"
- [ ] "App de seguimiento"
- [ ] "Evaluación corporal mensual"
- [ ] "2 días de freeze"
- [ ] "Acceso prioritario a eventos"

---

## Archivos Relacionados

### Nuevos a crear

**Páginas:**
- `app/mi-membresia/page.tsx`
- `app/mi-membresia/layout.tsx`

**Componentes:**
- `components/mi-membresia/TarjetaMembresia.tsx`
- `components/mi-membresia/ContadorDias.tsx`
- `components/mi-membresia/BarraProgreso.tsx`
- `components/mi-membresia/ListaPlanes.tsx`
- `components/mi-membresia/TarjetaPlan.tsx`
- `components/mi-membresia/Beneficios.tsx`
- `components/mi-membresia/HistorialMembresias.tsx`
- `components/mi-membresia/InfoContacto.tsx`
- `components/mi-membresia/index.ts`

**API Routes:**
- `app/api/mi-membresia/route.ts`
- `app/api/mi-membresia/historial/route.ts`

**Queries:**
- `lib/supabase/queries/mi-membresia.ts`

### A modificar

- `proxy.ts` — Agregar ruta `/mi-membresia` al matcher y proteger por rol
- `app/(marketing)/membresias/page.tsx` — Mostrar botón "Ver mi membresía" si está logueado
- `components/layout/Header.tsx` — Agregar link "Mi Membresía" para miembros logueados

### Sin modificar

- `app/recepcionista/*`, `app/gerente/*`
- `app/api/pagos/*`, `lib/supabase/queries/pagos.ts`
- `constants/plans.ts`
