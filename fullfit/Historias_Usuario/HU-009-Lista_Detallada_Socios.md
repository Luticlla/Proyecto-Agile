# HU-009: Lista Detallada de Socios Registrados

## Historia de Usuario
**Como** Recepcionista,
**Quiero** ver una lista detallada de todos los socios registrados,
**Para** tener visibilidad total de los clientes y el estado de sus membresías.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Resumen Estadístico

- [x] Se muestra una barra de resumen ANTES de la tabla de socios
- [x] La barra contiene 6 tarjetas con métricas:
  - [x] **Total Socios:** cantidad total de personas registradas
  - [x] **Activos:** socios con perfil activo (badge verde)
  - [x] **Inactivos:** socios con perfil inactivo (badge gris)
  - [x] **Membresías Activas:** cantidad de membresías vigentes
  - [x] **Por Vencer (7d):** membresías que vencen en 7 días o menos
  - [x] **Vencidas:** membresías que ya vencieron
- [x] Cada tarjeta tiene un ícono descriptivo
- [x] Los números se cargan automáticamente al abrir la página
- [x] Se muestra spinner mientras se cargan los datos

---

### 2. Tabla Detallada

**Columnas de la tabla:**
- [x] **Nombre:** nombre y apellido del socio
- [x] **DNI:** número de documento
- [x] **Email:** correo electrónico (oculto en pantallas pequeñas)
- [x] **Teléfono:** número de teléfono
- [x] **F. Registro:** fecha de creación del perfil (formato DD/MM/YYYY)
- [x] **Plan:** nombre del plan de membresía (Mensual, Trimestral, Anual) o "Sin plan"
- [x] **Vencimiento:** fecha de vencimiento de la membresía
- [x] **Días:** días restantes hasta el vencimiento con color
- [x] **Membresía:** badge con estado de la membresía
- [x] **Estado:** badge con estado del perfil (Activo/Inactivo)
- [x] **Acciones:** botones de acción disponibles

---

### 3. Ordenamiento por Columnas

- [x] Al hacer clic en el encabezado de una columna, se ordena ascendentemente
- [x] Al hacer clic nuevamente, se ordena descendentemente
- [x] Se muestra un ícono de flecha indicando la dirección del ordenamiento
- [x] Columnas ordenables: Nombre, DNI, F. Registro, Plan, Vencimiento, Días, Membresía, Estado
- [x] El ordenamiento se aplica sobre los datos de la página actual

---

### 4. Badges de Membresía

- [x] **Activa:** badge verde con texto "Activa"
- [x] **Por vencer:** badge amarillo con texto "Por vencer" (7 días o menos)
- [x] **Venció hoy:** badge rojo con texto "Venció hoy"
- [x] **Vencida:** badge rojo con texto "Vencida"
- [x] **Sin membresía:** badge gris con texto "Sin membresía"
- [x] Al pasar el mouse sobre el badge, se muestra un tooltip con:
  - [x] Nombre del plan
  - [x] Fecha de vencimiento

---

### 5. Indicadores de Días Restantes

- [x] **Más de 30 días:** texto verde
- [x] **16-30 días:** texto amarillo claro
- [x] **8-15 días:** texto amarillo
- [x] **1-7 días:** texto rojo
- [x] **Hoy:** texto rojo con "Hoy"
- [x] **Vencida:** texto rojo tachado con días vencidos
- [x] **Sin membresía:** guión medio gris

---

### 6. Indicadores Visuales en Filas

- [x] Filas con membresía vencida hoy: fondo ligeramente rojo
- [x] Filas con membresía vencida: fondo rojo muy tenue
- [x] Otras filas: fondo normal con efecto hover

---

### 7. Búsqueda y Filtros

- [x] Campo de búsqueda por nombre, DNI o teléfono
- [x] La búsqueda tiene un ligero retraso (300ms) para evitar muchas consultas
- [x] Se muestra spinner pequeño durante la búsqueda
- [x] Filtro por estado de membresía:
  - [x] Todos
  - [x] Con membresía activa
  - [x] Membresía vencida
  - [x] Sin membresía
- [x] Al cambiar el filtro, se resetea a la página 1
- [x] Se muestra el conteo de resultados: "X socio(s) encontrado(s)"

---

### 8. Paginación Mejorada

- [x] Selector de cantidad de elementos por página: 10, 25, 50, 100
- [x] Botones de navegación:
  - [x] Primera página (|<)
  - [x] Página anterior (<)
  - [x] Página siguiente (>)
  - [x] Última página (>|)
- [x] Input numérico para salto directo a página
- [x] Se muestra "Página X de Y"
- [x] Botones deshabilitados en los límites

---

### 9. Exportación CSV

- [x] Botón "Exportar CSV" disponible en la barra de herramientas
- [x] Al hacer clic, se descarga un archivo CSV con los datos filtrados
- [x] El archivo incluye todas las columnas visibles de la tabla
- [x] Nombre del archivo: `socios_fullforma_YYYY-MM-DD.csv`
- [x] Se muestra spinner mientras se genera el archivo
- [x] El botón se deshabilita si no hay datos para exportar

---

### 10. Acciones por Fila

- [x] **Ver:** botón con ícono de ojo, navega al detalle del socio
- [x] **Editar:** botón con ícono de lápiz, navega al detalle en modo edición
- [x] **Registrar Membresía:** botón verde con ícono de tarjeta (solo si no tiene membresía activa)
- [x] **Renovar:** botón amarillo con ícono de refrescar (solo si vence en 7 días o menos)

---

### 11. Estados de Carga

- [x] Spinner de carga mientras se cargan los socios
- [x] Filas con efecto de carga (skeleton) durante la carga
- [x] Spinner de carga en el resumen estadístico
- [x] Spinner en el botón de exportación

---

### 12. Manejo de Errores

- [x] Si no hay socios: muestra "Sin resultados" con mensaje descriptivo
- [x] Si hay error al cargar: muestra mensaje de error
- [x] Si la búsqueda no encuentra resultados: muestra "No se encontraron socios con los filtros actuales"

---

### 13. Base de Datos

**Tabla de perfiles (profiles):**
- [x] Almacena: nombre, apellido, DNI, email, teléfono, estado, fecha de creación

**Tabla de membresías (suscripciones):**
- [x] Almacena: usuario, plan, fecha inicio, fecha fin, estado

**Tabla de planes:**
- [x] Almacena: nombre, precio, duración en días

---

### 14. Seguridad

- [x] Solo recepcionistas pueden acceder a esta sección
- [x] Los datos se cargan solo para usuarios con rol de miembro
- [x] Las operaciones requieren autenticación
