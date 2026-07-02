# HU-008: Búsqueda Rápida de Perfil de Miembro

## Historia de Usuario
**Como** Recepcionista,
**Quiero** buscar rápidamente el perfil de un miembro con sus datos y estado de membresía,
**Para** responder consultas y resolver incidencias en el acto.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Búsqueda Rápida desde el Dashboard

- [x] Widget de búsqueda en el dashboard del recepcionista
- [x] Campo de búsqueda con ícono de lupa
- [x] Placeholder: "Buscar miembro por nombre o DNI..."
- [x] Al escribir, se muestran sugerencias en tiempo real (máximo 5 resultados)
- [x] La búsqueda tiene un ligero retraso (300ms) para evitar muchas consultas
- [x] Si se escriben menos de 2 caracteres, no se busca
- [x] Botón "X" para limpiar el campo de búsqueda

---

### 2. Resultados de Búsqueda

- [x] Los resultados aparecen en un panel desplegable debajo del campo
- [x] Cada resultado muestra:
  - [x] Icono de persona
  - [x] Nombre completo del miembro
  - [x] Número de DNI
  - [x] Badge de estado de membresía: "Activa" (verde) o "Vencida" (rojo)
- [x] Al hacer clic en un resultado, se navega al detalle del cliente
- [x] Si no hay resultados, se muestra "No se encontraron miembros"
- [x] Si está cargando, se muestra "Buscando..."

---

### 3. Lista de Clientes

- [x] Tabla con columnas: Nombre, DNI, Email, Teléfono, Membresía, Estado, Acciones
- [x] Búsqueda por nombre, DNI o teléfono
- [x] Filtro por estado de membresía:
  - [x] Todos
  - [x] Con membresía activa
  - [x] Membresía vencida
  - [x] Sin membresía
- [x] Paginación con botones "Anterior" y "Siguiente"
- [x] Conteo de resultados: "X cliente(s) encontrado(s)"
- [x] Badges de membresía: Activa (verde), Vencida (rojo), Sin membresía (gris)
- [x] Badges de estado: Activo (verde), Inactivo (gris)
- [x] Acciones por fila: "Ver" (ícono ojo) y "Editar" (ícono lápiz)

---

### 4. Indicadores de Urgencia en la Lista

- [x] Membresías por vencer (7 días o menos): badge amarillo con "Vence en X días"
- [x] Membresías vencidas hoy: badge rojo con "Venció hoy"
- [x] Estos badges aparecen en la columna de membresía de la tabla

---

### 5. Detalle del Cliente

- [x] Se accede al hacer clic en "Ver" desde la lista o desde la búsqueda rápida
- [x] Se muestra el nombre completo del cliente como título
- [x] Botón de regreso a la lista
- [x] Botón "Editar" para modificar datos del cliente
- [x] Botón "Registrar Membresía" para crear una nueva membresía

---

### 6. Tarjeta de Datos del Cliente

- [x] Muestra todos los datos del perfil:
  - [x] Nombre y apellido
  - [x] DNI
  - [x] Email
  - [x] Teléfono
  - [x] Género
  - [x] Fecha de nacimiento
  - [x] Estado: Activo (verde) o Inactivo (gris)

---

### 7. Sección de Membresía en el Detalle

- [x] Título: "Membresía" con ícono de tarjeta
- [x] Badge de estado: Activa (verde), Vencida (rojo), Cancelada (gris), Suspendida (amarillo)
- [x] Información del plan:
  - [x] Nombre del plan (Mensual, Trimestral, Anual)
  - [x] Precio del plan en soles
  - [x] Duración en días
- [x] Fechas:
  - [x] Fecha de inicio
  - [x] Fecha de vencimiento
- [x] Si la membresía está activa, muestra días restantes:
  - [x] Más de 30 días: texto verde
  - [x] 7-30 días: texto amarillo
  - [x] Menos de 7 días: texto rojo
- [x] Si no tiene membresía, muestra "Sin membresía activa"

---

### 8. Historial de Pagos en el Detalle

- [x] Título: "Historial de Pagos" con ícono de recibo
- [x] Muestra los últimos 5 pagos del cliente
- [x] Cada pago muestra:
  - [x] Monto en soles
  - [x] Método de pago (Efectivo, MercadoPago, etc.)
  - [x] Fecha del pago
  - [x] Badge de estado: Completado (verde), Pendiente (amarillo), Fallido (rojo)
- [x] Si no hay pagos, muestra "No hay pagos registrados para este cliente"

---

### 9. Edición del Cliente

- [x] Botón "Editar" cambia a modo edición
- [x] Se muestra formulario con los datos actuales del cliente
- [x] Campos editables: nombre, apellido, DNI, teléfono, género, fecha de nacimiento
- [x] Botón "Guardar" para confirmar cambios
- [x] Botón "Cancelar" para volver al modo vista
- [x] Validaciones: nombre requerido, apellido requerido, DNI 8 dígitos

---

### 10. Registro de Nueva Membresía

- [x] Botón "Registrar Membresía" en el detalle del cliente
- [x] Se muestra formulario con nombre del cliente
- [x] Selección de plan (lista de planes activos)
- [x] Selección de método de pago: Efectivo o MercadoPago
- [x] Resumen antes de confirmar (monto total, vigencia)
- [x] Si elige Efectivo: se genera boleta PDF y se descarga
- [x] Si elige MercadoPago: se redirige al checkout

---

### 11. Renovación de Membresía

- [x] Botón "Renovar" disponible si la membresía vence en 7 días o menos o está vencida
- [x] Se muestra aviso: "Modo Renovación" con fecha de vencimiento actual
- [x] Se indica que los días restantes se sumarán al nuevo plan
- [x] Mismo formulario que registro de membresía

---

### 12. Métricas del Dashboard

- [x] El dashboard muestra tarjetas con datos reales:
  - [x] Total de clientes registrados
  - [x] Membresías activas
  - [x] Membresías por vencer (en los próximos 7 días)
- [x] Lista de membresías próximas a vencer con nombre, apellido, plan y días restantes

---

### 13. Manejo de Estados de Carga

- [x] Spinner de carga durante búsqueda de clientes
- [x] Spinner de carga durante carga del detalle del cliente
- [x] Spinner de carga durante carga de membresía
- [x] Spinner de carga durante carga de pagos
- [x] Spinner de carga durante carga de planes
- [x] Mensaje "Cargando..." mientras se procesan las solicitudes

---

### 14. Manejo de Errores

- [x] Si el cliente no existe: muestra "Cliente no encontrado" con enlace a volver
- [x] Si hay error al cargar datos: muestra mensaje de error
- [x] Si la búsqueda no encuentra resultados: muestra "No se encontraron miembros"
- [x] Si no hay pagos registrados: muestra mensaje informativo

---

### 15. Base de Datos

**Tabla de perfiles (profiles):**
- [x] Almacena: nombre, apellido, DNI, email, teléfono, género, fecha de nacimiento, estado

**Tabla de membresías (suscripciones):**
- [x] Almacena: usuario, plan, fecha inicio, fecha fin, estado

**Tabla de planes:**
- [x] Almacena: nombre, precio, duración en días

**Tabla de pagos:**
- [x] Almacena: monto, método, estado, fecha, usuario

---

### 16. Seguridad

- [x] Solo recepcionistas pueden acceder a esta sección
- [x] Las búsquedas requieren autenticación
- [x] Los datos se cargan solo para usuarios con rol de miembro
