# HU-006: Plataforma de Pago Online — MercadoPago (Yape + Tarjetas)

## Historia de Usuario
**Como** Socio (miembro registrado),
**Quiero** pagar con Yape o tarjeta a través de MercadoPago,
**Para** usar los medios de pago más comunes en Perú.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Página de Pasarela de Pago

- [x] La página se encuentra en `/pasarelapago`
- [x] Mismo estilo visual del sitio (fondo oscuro)
- [x] Botón "Volver a planes" para regresar a `/membresias`
- [x] Se muestra un resumen del plan seleccionado antes de pagar

---

### 2. Resumen del Plan

- [x] Tarjeta con el nombre del plan
- [x] Descripción del plan (si existe)
- [x] Precio total formateado en soles (S/)
- [x] Precio por mes debajo del total (excepto planes anuales que muestran "al año")
- [x] Lista de beneficios/features del plan con ícono de check

---

### 3. Botón de Pago

- [x] Botón amarillo con texto "Pagar con Mercado Pago"
- [x] Ícono de tarjeta de crédito a la izquierda del texto
- [x] **Deshabilitado** mientras se procesa la solicitud
- [x] **Estado de carga:** muestra ícono giratorio mientras procesa
- [x] Al hacer clic, inicia el proceso de pago

---

### 4. Flujo de Autenticación

- [x] Si el usuario NO está autenticado, redirige al login
- [x] Después de iniciar sesión, regresa a la pasarela de pago automáticamente
- [x] Mientras se verifica la sesión, se muestra spinner de carga

---

### 5. Validación de Membresía Activa

- [x] Antes de permitir el pago, se verifica si el usuario ya tiene membresía activa
- [x] Si tiene membresía activa con más de 7 días restantes:
  - [x] Se muestra mensaje: "Tu membresía está activa y vence en X días"
  - [x] Se muestra texto: "Podrás renovar cuando falten 7 días o menos"
  - [x] Se bloquea el botón de pago
- [x] Si tiene membresía activa con 7 días o menos, se permite la renovación

---

### 6. Creación del Pago

- [x] Se valida que el usuario esté autenticado
- [x] Se valida que el plan exista y esté activo
- [x] Se verifica si el usuario tiene membresía activa:
  - [x] Si vence en más de 7 días: se muestra error indicando que aún no puede renovar
  - [x] Si vence en 7 días o menos: se permite la renovación (se acumulan los días)
- [x] Se calcula la fecha de inicio y fin según sea nueva membresía o renovación:
  - [x] Nueva membresía: empieza hoy, termina según duración del plan
  - [x] Renovación: empieza cuando vence la actual, se suman los días del nuevo plan
- [x] Se envía la solicitud a MercadoPago con los datos del plan y usuario
- [x] Se recibe una URL de pago y se redirige al usuario

---

### 7. Redirección a MercadoPago

- [x] El usuario es redirigido al checkout de MercadoPago
- [x] MercadoPago muestra los métodos de pago disponibles:
  - [x] Yape
  - [x] Tarjeta de débito
  - [x] Tarjeta de crédito
  - [x] Pago en efectivo (agente MercadoPago)
  - [x] Credito Mercado Pago

---

### 8. Estados Post-Pago

- [x] Después de pagar, el usuario regresa a la pasarela con un estado:
  - [x] **Aprobado:** "¡Pago aprobado!" en verde, "Tu membresía está activa"
  - [x] **Rechazado:** "Pago no procesado" en rojo, "El pago no pudo ser completado"
  - [x] **Pendiente:** "Pago pendiente" en amarillo, "Tu pago está siendo procesado"
- [x] Cada estado muestra botón "Volver al inicio"
- [x] Mientras se verifica el pago, se muestra spinner con texto "Verificando tu pago..."

---

### 9. Verificación del Pago

- [x] Se consulta el estado del pago en MercadoPago
- [x] Si el pago no está aprobado, se muestra error
- [x] Se procesa la activación de la membresía

---

### 10. Activación de la Membresía

- [x] **Deduplicación:** Se verifica si el pago ya fue procesado anteriormente
- [x] Si ya fue procesado, no se vuelve a procesar (evita duplicados)
- [x] Si el pago fue rechazado:
  - [x] Se registra el pago fallido en el historial
- [x] Si el pago fue aprobado:
  - [x] Se valida que el usuario y el plan existan
  - [x] **Si tiene membresía activa (renovación):**
    - [x] Se extiende la fecha de vencimiento sumando la duración del plan
    - [x] Se registra el pago en el historial
    - [x] Se envía notificación: "Membresía extendida" con nueva fecha
  - [x] **Si NO tiene membresía activa (nueva):**
    - [x] Se crea una nueva membresía con estado "activa"
    - [x] Se calcula la fecha de vencimiento = hoy + duración del plan
    - [x] Se registra el pago en el historial
    - [x] Se envía notificación: "Membresía activada" con fecha de vencimiento

---

### 11. Webhook de MercadoPago

- [x] MercadoPago envía notificaciones automáticas cuando cambia el estado de un pago
- [x] Se verifica que la notificación sea auténtica (firma de seguridad)
- [x] Se procesan solo las notificaciones de tipo "pago"
- [x] Se ignora cualquier otro tipo de notificación
- [x] Se aplica la misma lógica de activación que en la verificación manual

---

### 12. Base de Datos

**Tabla de pagos:**
- [x] Registra cada intento de pago con: monto, método (MercadoPago), estado (completado/fallido), referencia del pago
- [x] Referencia única para evitar procesar el mismo pago dos veces

**Tabla de membresías:**
- [x] Almacena cada membresía con: usuario, plan, fecha inicio, fecha fin, estado
- [x] Estados: activa, vencida, cancelada, suspendida

**Tabla de notificaciones:**
- [x] Envía notificación al usuario cuando se activa o extiende su membresía

---

### 13. Seguridad

- [x] Solo usuarios autenticados pueden iniciar un pago
- [x] Las operaciones sensibles se ejecutan en el servidor (no en el navegador)
- [x] Las notificaciones de MercadoPago se verifican con firma de seguridad
- [x] No se permite procesar el mismo pago dos veces

---

### 14. Manejo de Errores

- [x] Plan no encontrado o inactivo: se muestra mensaje de error
- [x] Datos de entrada inválidos: se muestra mensaje de error
- [x] Membresía activa con más de 7 días: se muestra mensaje informativo
- [x] Error al conectar con MercadoPago: se muestra mensaje de error
- [x] Firma de webhook inválida: se rechaza la notificación

---

### 15. Métodos de Pago Aceptados (vía MercadoPago)

- [x] Yape
- [x] Tarjeta de débito
- [x] Tarjeta de crédito
- [x] Credito Mercado Pago
- [x] Pago en efectivo (agente MercadoPago)

---

### 16. Estilo General

- [x] **Fondo**: negro en toda la página
- [x] **Tarjeta de resumen**: fondo oscuro, bordes sutiles
- [x] **Botón de pago**: amarillo con texto oscuro
- [x] **Fuentes**: arcade para títulos y botones, monoespaciada para descripciones
- [x] **Estados de pago**: verde (aprobado), rojo (rechazado), amarillo (pendiente)
