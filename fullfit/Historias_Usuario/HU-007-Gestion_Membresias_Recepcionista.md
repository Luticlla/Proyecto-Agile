# HU-007: Gestión de Membresías por Recepcionista

## Historia de Usuario
**Como** Recepcionista,
**Quiero** gestionar las membresías de los clientes (cambiar estado, registrar, renovar y suspender),
**Para** manejar la membresía del cliente acorde a su situación.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Acceso y Permisos

- [x] Solo usuarios con rol de recepcionista pueden acceder a la sección de membresías
- [x] Si no está autenticado, redirige al login
- [x] Si no es recepcionista, redirige a la página principal
- [x] El header muestra navegación: Clientes, Membresías, Reportes
- [x] El header muestra el nombre del recepcionista y botón cerrar sesión

---

### 2. Página Principal de Membresías

- [x] Título: "Membresías"
- [x] Subtítulo: "Gestiona las membresías de los clientes"
- [x] Se muestra una tabla con todas las membresías
- [x] Se incluye campo de búsqueda y selector de cantidad por página

---

### 3. Tabla de Membresías

**Columnas de la tabla:**
- [x] **Cliente:** nombre y apellido del cliente
- [x] **DNI:** número de DNI del cliente
- [x] **Plan:** nombre del plan (Mensual, Trimestral, Anual)
- [x] **Estado:** badge con color según estado
- [x] **Inicio:** fecha de inicio de la membresía
- [x] **Vencimiento:** fecha de vencimiento de la membresía
- [x] **Restante:** días restantes con badge de color
- [x] **Acciones:** botones según el estado de la membresía

**Estados y colores de badge:**
- [x] **Activa:** badge verde
- [x] **Vencida:** badge rojo
- [x] **Cancelada:** badge gris
- [x] **Suspendida:** badge amarillo

**Badges de días restantes:**
- [x] **Más de 30 días:** verde
- [x] **7-30 días:** amarillo
- [x] **Menos de 7 días:** rojo
- [x] **Vencida:** rojo con texto tachado

---

### 4. Búsqueda y Filtros

- [x] Campo de búsqueda por nombre o DNI del cliente
- [x] Botón "Buscar" o presionar Enter para buscar
- [x] Selector de cantidad de elementos por página: 10, 25, 50
- [x] La búsqueda se ejecuta al hacer clic en Buscar o presionar Enter
- [x] Se muestra mensaje "No se encontraron membresías" si no hay resultados

---

### 5. Paginación

- [x] Se muestra "Página X de Y" debajo de la tabla
- [x] Botones "Anterior" y "Siguiente" para navegar
- [x] Botón "Anterior" deshabilitado en la primera página
- [x] Botón "Siguiente" deshabilitado en la última página

---

### 6. Acciones por Estado de Membresía

**Si la membresía está ACTIVA:**
- [x] Botón "Pausar" (ícono de pausa, color amarillo)
- [x] Botón "Cancelar" (ícono de X, color rojo)
- [x] Botón "Renovar" (ícono de refrescar, color verde) — solo si vence en 7 días o menos

**Si la membresía está SUSPENDIDA:**
- [x] Botón "Reactivar" (ícono de play, color verde)
- [x] Botón "Cancelar" (ícono de X, color rojo)

**Si la membresía está CANCELADA:**
- [x] Botón "Reactivar" (ícono de play, color verde)

**Si la membresía está VENCIDA:**
- [x] Botón "Renovar" (ícono de refrescar, color verde)
- [x] Botón "Reactivar" (ícono de play, color amarillo)

---

### 7. Modal de Confirmación

- [x] Al hacer clic en cualquier acción, se abre un modal de confirmación
- [x] El modal muestra:
  - [x] Título según la acción (ej: "Cancelar Membresía")
  - [x] Descripción con la pregunta de confirmación
  - [x] Botón "Cancelar" para cerrar el modal
  - [x] Botón de acción (ej: "Cancelar Membresía") con color según la acción

**Textos de confirmación:**
- [x] **Cancelar:** "¿Estás seguro de cancelar esta membresía? El cliente perderá el acceso."
- [x] **Pausar:** "¿Estás seguro de pausar esta membresía? El acceso será suspendido temporalmente."
- [x] **Reactivar:** "¿Estás seguro de reactivar esta membresía? El cliente recuperará el acceso."
- [x] **Renovar:** "¿Confirmar la renovación de esta membresía?"

**Colores del botón de acción:**
- [x] **Cancelar:** rojo (peligro)
- [x] **Pausar:** amarillo (advertencia)
- [x] **Reactivar:** verde (éxito)
- [x] **Renovar:** verde (éxito)

---

### 8. Cambiar Estado de Membresía

**Pausar membresía:**
- [x] La membresía cambia de "activa" a "suspendida"
- [x] El cliente pierde acceso temporalmente

**Cancelar membresía:**
- [x] La membresía cambia a "cancelada"
- [x] El cliente pierde acceso

**Reactivar membresía:**
- [x] La membresía cambia a "activa"
- [x] El cliente recupera acceso

---

### 9. Registrar Nueva Membresía

- [x] Se accede desde el detalle del cliente
- [x] Se muestra formulario con nombre del cliente
- [x] **Selección de plan:**
  - [x] Lista de planes activos con radio buttons
  - [x] Cada plan muestra: nombre, duración en días, precio total, precio por mes
  - [x] Plan seleccionado se resalta con borde amarillo
- [x] **Método de pago:**
  - [x] Dos opciones: Efectivo o MercadoPago
  - [x] Cada opción tiene ícono y texto
  - [x] Opción seleccionada se resalta con borde de color
- [x] **Resumen:**
  - [x] Muestra el total a pagar en soles
  - [x] Muestra la vigencia (días desde la fecha de inicio)
- [x] **Botón "Registrar Membresía":**
  - [x] Deshabilitado hasta seleccionar un plan
  - [x] Muestra spinner mientras procesa
- [x] Si elige **Efectivo:**
  - [x] Se crea la membresía inmediatamente
  - [x] Se genera una boleta PDF automáticamente
  - [x] Se descarga la boleta
- [x] Si elige **MercadoPago:**
  - [x] Se redirige al checkout de MercadoPago
  - [x] Después de pagar, se activa la membresía

---

### 10. Renovar Membresía

- [x] El botón "Renovar" solo aparece si:
  - [x] La membresía está activa y vence en 7 días o menos, O
  - [x] La membresía está vencida
- [x] Al hacer clic, se abre modal de confirmación
- [x] Al confirmar:
  - [x] Si es pago en efectivo: se genera boleta y se extiende la membresía
  - [x] Si es pago con MercadoPago: se redirige al checkout
- [x] La fecha de vencimiento se extiende según la duración del plan

---

### 11. Boleta PDF (Pago en Efectivo)

- [x] La boleta incluye:
  - [x] Datos del gimnasio (nombre, dirección, RUC)
  - [x] Datos del cliente (nombre, DNI)
  - [x] Detalle del plan (nombre, precio)
  - [x] Monto total pagado
  - [x] Fecha de inicio y vencimiento
  - [x] Número de boleta secuencial
- [x] La boleta se genera automáticamente al registrar o renovar con efectivo
- [x] La boleta se descarga en formato PDF

---

### 12. Base de Datos

**Tabla de membresías (suscripciones):**
- [x] Almacena: usuario, plan, fecha inicio, fecha fin, estado
- [x] Estados: activa, vencida, cancelada, suspendida

**Tabla de pagos:**
- [x] Registra cada pago con: monto, método, estado, referencia
- [x] Vinculado a la membresía

**Registro de acciones (auditoría interna):**
- [x] El sistema registra automáticamente cada acción realizada por el recepcionista
- [x] Información registrada: usuario que realizó la acción, tipo de acción, fecha, membresía afectada
- [x] Este registro es interno del sistema para trazabilidad
- [x] No es visible para el recepcionista en la interfaz

---

### 13. Seguridad

- [x] Solo recepcionistas pueden acceder a la sección
- [x] Todas las API requieren autenticación
- [x] Las acciones quedan registradas internamente para trazabilidad
- [x] Políticas de base de datos restringen el acceso

---

### 14. Manejo de Errores

- [x] Si la membresía no existe: se muestra mensaje de error
- [x] Si la acción no es válida: se muestra mensaje de error
- [x] Si hay error al procesar: se muestra mensaje de error
- [x] Si el plan no está disponible: se muestra mensaje de error

---

### 15. Estilo General

- [x] **Fondo:** color gris oscuro en toda la sección
- [x] **Tablas:** fondo gris oscuro, bordes sutiles
- [x] **Badges:** colores consistentes por estado (verde, rojo, amarillo, gris)
- [x] **Botones:** colores según acción (verde=éxito, amarillo=advertencia, rojo=peligro)
- [x] **Fuentes:** arcade para títulos, monoespaciada para contenido
