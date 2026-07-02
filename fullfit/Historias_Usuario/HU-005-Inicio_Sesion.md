# HU-005: Inicio de Sesión

## Historia de Usuario
**Como** usuario miembro del sistema,
**Quiero** iniciar sesión con mi email o DNI,
**Para** acceder a mi cuenta.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Estructura de la Página

[x] Fondo gris oscuro (no negro como las páginas principales)
[x] Formulario centrado vertical y horizontalmente en la pantalla
[x] Tarjeta con fondo gris oscuro, bordes redondeados y borde sutil
[x] Título "Bienvenido de nuevo" en color blanco, tamaño grande, centrado
[x] Subtítulo "Inicia sesión para acceder a tu cuenta" debajo del título, en color gris

---

### 2. Campo de Email o DNI

[x] Campo de entrada único que acepta email o DNI
[x] Label: "Email o DNI"
[x] Placeholder: "tu@email.com o 12345678"
[x] El sistema detecta automáticamente si es email (contiene "@") o DNI (8 dígitos numéricos)
[x] Si es email: se usa directamente para autenticar
[x] Si es DNI: se busca el email asociado en la base de datos antes de autenticar

---

### 3. Campo de Contraseña

[x] Campo de contraseña (oculta el texto)
[x] Label: "Contraseña"
[x] Placeholder: "••••••••"
[x] Enlace "¿Olvidaste tu contraseña?" al lado del label, lleva a `/forgot-password`

---

### 4. Validaciones

**Email o DNI:**
[x] Si está vacío: campo obligatorio
[x] Si no es email ni DNI válido: "Ingrese un email válido o DNI de 8 dígitos"
[x] Si es DNI pero no se encuentra en la base de datos: "DNI no encontrado"

**Contraseña:**
[x] Si está vacía: campo obligatorio

**Autenticación:**
[x] Si las credenciales son incorrectas: se muestra el mensaje de error del servidor

---

### 5. Botón "Iniciar Sesión"

[x] Botón amarillo con texto oscuro, ancho completo
[x] **Deshabilitado** mientras se procesa la solicitud
[x] **Habilitado** cuando los campos están llenos

**Estado de carga:**
[x] Mientras se envía el formulario, muestra ícono giratorio y texto "Iniciando sesión..."

---

### 6. Flujo de Redireccionamiento

**Si hay parámetro `redirect` en la URL:**
[x] Después de iniciar sesión, redirige a la URL especificada en el parámetro
[x] Ejemplo: `/login?redirect=/pasarelapago?plan=1` → redirige a `/pasarelapago?plan=1`

**Si NO hay parámetro `redirect`:**
[x] Después de iniciar sesión, redirige a la página principal `/`

---

### 7. Mensajes de Error

[x] Los errores se muestran dentro de la tarjeta, arriba del formulario
[x] Fondo rojo tenue, borde rojo, texto rojo
[x] Se ocultan automáticamente al corregir el error

---

### 8. Enlaces y Navegación

[x] **"Volver al inicio"**: enlace arriba del formulario con ícono de flecha hacia la izquierda, lleva a la página principal
[x] **"¿No tienes cuenta? Regístrate aquí"**: enlace debajo del formulario, lleva a la página de registro
[x] **"¿Olvidaste tu contraseña?"**: enlace al lado del campo de contraseña, lleva a `/forgot-password`

---

### 9. Redirección si Autenticado

[x] Si el usuario ya tiene sesión activa, redirige automáticamente a la página principal o a la URL del parámetro `redirect`

---

### 10. Estilo General

[x] **Fondo**: gris oscuro (no negro)
[x] **Tarjeta**: fondo gris oscuro, bordes redondeados, sombra sutil
[x] **Campos de entrada**: fondo gris, bordes grises, texto blanco
[x] **Etiquetas**: color gris claro, tamaño pequeño
[x] **Botón principal**: amarillo con texto oscuro
[x] **Enlaces**: amarillo con subrayado al pasar el mouse
[x] **Errores**: rojo con fondo rojo tenue
