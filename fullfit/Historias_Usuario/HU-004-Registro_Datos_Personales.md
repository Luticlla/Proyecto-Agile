# HU-004: Registro de Datos Personales

## Historia de Usuario
**Como** Socio (nuevo usuario),
**Quiero** registrar mis datos personales de forma segura,
**Para** obtener una inscripción en el gym y acceder a los servicios de membresía.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Estructura de la Página

[x] Fondo gris oscuro (no negro como las páginas principales)
[x] Formulario centrado vertical y horizontalmente en la pantalla
[x] Tarjeta con fondo gris oscuro, bordes redondeados y borde sutil
[x] Título "Crear Cuenta" en color blanco, tamaño grande, centrado
[x] Subtítulo "Únete a Full Forma y alcanza tus metas" debajo del título, en color gris

---

### 2. Validación de DNI con RENIEC

**Campo de DNI:**
[x] Campo de entrada para el DNI (8 dígitos numéricos)
[x] Solo acepta números (no permite letras ni caracteres especiales)
[x] Botón "Validar" al lado del campo
[x] El botón se deshabilita si el DNI tiene menos de 8 dígitos
[x] Mientras se valida, muestra ícono giratorio

**Después de validar:**
[x] Se muestra mensaje "Validado con RENIEC" en color verde junto al campo
[x] Los campos "Nombre" y "Apellido" se llenan automáticamente con los datos de RENIEC
[x] Los campos "Nombre" y "Apellido" se bloquean (no se pueden editar)
[x] El campo DNI también se bloquea
[x] Si el usuario cambia el DNI después de validar, se resetea la validación y se limpian nombre y apellido

**Errores de validación RENIEC:**
[x] Si el DNI no tiene 8 dígitos: "Ingresa los 8 dígitos del DNI antes de validar"
[x] Si RENIEC no encuentra el DNI: "Error al consultar RENIEC"
[x] Si no se puede conectar con RENIEC: "No se pudo conectar con el servicio RENIEC. Intenta más tarde."

---

### 3. Campos del Formulario

**Nombre:**
[x] Campo obligatorio
[x] Solo acepta letras (no permite números ni caracteres especiales)
[x] Se bloquea después de validar el DNI con RENIEC

**Apellido:**
[x] Campo obligatorio
[x] Solo acepta letras (no permite números ni caracteres especiales)
[x] Se bloquea después de validar el DNI con RENIEC

**Email:**
[x] Campo obligatorio
[x] Tipo email (validación automática del navegador)
[x] Validación adicional con expresión regular

**Teléfono (opcional):**
[x] Campo opcional
[x] Prefijo fijo "+51" (Perú) que no se puede editar
[x] Solo acepta números
[x] Máximo 9 dígitos
[x] Debe empezar con 9
[x] Placeholder: "999 999 999"

**Fecha de Nacimiento:**
[x] Campo obligatorio
[x] Tipo fecha (abre selector de calendario)
[x] Restricción: solo mayores de 18 años
[x] Restricción: máximo 100 años atrás

**Sexo:**
[x] Campo obligatorio
[x] Menú desplegable con opciones:
  - Masculino
  - Femenino
  - Prefiero no decirlo
[x] Si selecciona "Prefiero no decirlo", se envía como valor nulo

**Contraseña:**
[x] Campo obligatorio
[x] Tipo contraseña (oculta el texto)
[x] Mínimo 8 caracteres
[x] No puede contener solo números
[x] Mensaje de ayuda: "Mínimo 8 caracteres, no solo números"

**Confirmar Contraseña:**
[x] Campo obligatorio
[x] Tipo contraseña (oculta el texto)
[x] Debe coincidir con la contraseña

**Términos y Condiciones:**
[x] Checkbox con label: "Acepto los Términos y Condiciones"
[x] "Términos y Condiciones" es un enlace que abre en nueva pestaña
[x] El checkbox debe estar marcado para poder crear la cuenta
[x] Si no está marcado y se intenta enviar: "Debes aceptar los Términos y Condiciones para continuar"

---

### 4. Validaciones del Formulario

**Contraseña:**
[x] Si tiene menos de 8 caracteres: "La contraseña debe tener al menos 8 caracteres"
[x] Si contiene solo números: "La contraseña no puede contener solo números"
[x] Si no coincide con confirmar contraseña: "Las contraseñas no coinciden"

**DNI:**
[x] Si no tiene exactamente 8 dígitos: "El DNI debe tener exactamente 8 dígitos"

**Email:**
[x] Si no es válido: "El correo no es válido"

**Fecha de Nacimiento:**
[x] Si está vacía: "La fecha de nacimiento es obligatoria"
[x] Si tiene menos de 18 años: "Debes ser mayor de 18 años para registrarte"

**Sexo:**
[x] Si no selecciona ninguna opción: "Selecciona tu sexo"

**Teléfono:**
[x] Si tiene número pero no empieza con 9 o no tiene 9 dígitos: "El teléfono debe tener 9 dígitos y comenzar con 9"

**Términos y Condiciones:**
[x] Si no está marcado: "Debes aceptar los Términos y Condiciones para continuar"

---

### 5. Mensajes de Error

[x] Los errores se muestran en la parte superior del formulario
[x] Fondo rojo tenue, borde rojo, texto rojo
[x] Ícono de error (círculo con X) junto al mensaje
[x] Los errores de campos específicos se muestran debajo de cada campo

---

### 6. Botón "Crear Cuenta"

[x] Botón amarillo con texto oscuro, ancho completo
[x] **Deshabilitado** cuando:
  - El DNI no está validado con RENIEC
  - El email no es válido
  - La contraseña está vacía
  - Hay errores de contraseña
  - Las contraseñas no coinciden
  - La fecha de nacimiento está vacía
  - El sexo no está seleccionado
  - El checkbox de Términos y Condiciones no está marcado
[x] **Habilitado** solo cuando todas las condiciones se cumplen
[x] Mensaje de ayuda cuando está deshabilitado: "Completa todos los campos, valida tu DNI y acepta los Términos"

**Estado de carga:**
[x] Mientras se envía el formulario, muestra ícono giratorio y texto "Creando cuenta..."

---

### 7. Flujo de Envío

[x] Se envían los datos: email, contraseña y metadatos (nombre, apellido, teléfono, DNI, fecha de nacimiento, género)
[x] Si "Prefiero no decirlo" está seleccionado, se envía como valor nulo
[x] Si el teléfono está vacío, no se envía
[x] Si hay error del servidor, se muestra el mensaje de error
[x] Si es exitoso, se muestra alerta: "¡Registro exitoso! Por favor verifica tu email para confirmar tu cuenta."
[x] Después del envío exitoso, redirige a la página de login

---

### 8. Enlaces y Navegación

[x] **"Volver al inicio"**: enlace arriba del formulario con ícono de flecha hacia la izquierda, lleva a la página principal
[x] **"¿Ya tienes cuenta? Inicia sesión aquí"**: enlace debajo del formulario, lleva a la página de login

---

### 9. Redirección si Autenticado

[x] Si el usuario ya tiene sesión activa como socio, redirige a la página principal
[x] Si el usuario ya tiene sesión activa como recepcionista o administrador, redirige a la página del recepcionista

---

### 10. Estilo General

[x] **Fondo**: gris oscuro (no negro)
[x] **Tarjeta**: fondo gris oscuro, bordes redondeados, sombra sutil
[x] **Campos de entrada**: fondo gris, bordes grises, texto blanco
[x] **Etiquetas**: color gris claro, tamaño pequeño
[x] **Botón principal**: amarillo con texto oscuro
[x] **Enlaces**: amarillo con subrayado al pasar el mouse
[x] **Errores**: rojo con fondo rojo tenue
[x] **Checkbox**: borde gris, al marcarse cambia a amarillo
