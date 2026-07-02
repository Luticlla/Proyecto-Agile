# HU-010: Gestión de Usuarios del Sistema

## Historia de Usuario
**Como** Gerente,
**Quiero** gestionar las cuentas de los usuarios del sistema (crear, editar y desactivar),
**Para** que solo el personal autorizado tenga acceso a las funciones correspondientes.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Acceso y Permisos

- [x] Solo el gerente puede acceder a la sección de gestión de usuarios
- [x] Si un recepcionista intenta acceder, se le redirige a su área de trabajo
- [x] Si un miembro intenta acceder, se le redirige a la página principal
- [x] Si el usuario no ha iniciado sesión, se le redirige al formulario de login
- [x] Los usuarios que han sido desactivados no pueden iniciar sesión aunque tengan contraseña correcta

---

### 2. Panel de Gestión

- [x] Existe una sección dedicada para gestionar los usuarios del sistema
- [x] El panel tiene un título "Personal del Sistema" con subtítulo "Gestiona los administradores y recepcionistas"
- [x] Existe un botón "Nuevo Usuario" para agregar personal
- [x] El panel muestra una tabla con todos los usuarios registrados

---

### 3. Tabla de Usuarios

**Columnas de la tabla:**
- [x] **Nombre:** nombre y apellido del usuario
- [x] **DNI:** número de documento de identidad
- [x] **Email:** correo electrónico (oculto en pantallas pequeñas)
- [x] **Teléfono:** número de contacto
- [x] **Rol:** badge con el rol del usuario (Administrador en amarillo, Recepcionista en azul)
- [x] **Estado:** badge con el estado (Activo en verde, Inactivo en rojo)
- [x] **Registro:** fecha de creación del usuario
- [x] **Acciones:** botones para editar o cambiar estado

---

### 4. Crear Nuevo Usuario

- [x] Al hacer clic en "Nuevo Usuario" se abre un formulario
- [x] El formulario tiene los siguientes campos:
  - [x] **Nombre:** obligatorio, solo letras
  - [x] **Apellido:** obligatorio, solo letras
  - [x] **DNI:** obligatorio, 8 dígitos numéricos, se valida automáticamente con RENIEC
  - [x] **Email:** obligatorio, debe ser un email válido
  - [x] **Teléfono:** opcional
  - [x] **Contraseña:** obligatoria, mínimo 8 caracteres, no puede ser solo números
  - [x] **Rol:** obligatorio, selección entre Administrador o Recepcionista (por defecto: Recepcionista)
- [x] Al enviar el formulario:
  - [x] Se muestra un ícono giratorio mientras se procesa
  - [x] Si es exitoso: se muestra un mensaje de confirmación y se cierra el formulario
  - [x] Si hay error (email duplicado, DNI duplicado): se muestra un mensaje claro en español

---

### 5. Editar Usuario

- [x] Cada fila de la tabla tiene un botón de "Editar"
- [x] Al hacer clic se abre un formulario con los datos actuales del usuario
- [x] Campos editables: Nombre, Apellido, DNI, Teléfono, Rol
- [x] El campo Email NO se puede modificar (es parte de la cuenta de acceso)
- [x] La contraseña NO se puede cambiar desde aquí (se usa el flujo de recuperación)
- [x] Al guardar: se muestra un mensaje de confirmación y se actualiza la tabla

---

### 6. Desactivar y Activar Usuario

- [x] Cada fila tiene un botón para cambiar el estado del usuario:
  - [x] Si está activo: muestra botón de "Desactivar"
  - [x] Si está inactivo: muestra botón de "Activar"
- [x] Al hacer clic en "Desactivar" se muestra un cuadro de confirmación:
  - [x] Pregunta: "¿Estás seguro de desactivar la cuenta de [Nombre]?"
  - [x] Advertencia: "Este usuario no podrá iniciar sesión hasta que sea reactivado"
  - [x] Botones: "Cancelar" y "Desactivar" (en rojo)
- [x] Al confirmar la desactivación:
  - [x] El usuario pierde acceso inmediatamente
  - [x] Se actualiza el estado en la tabla
- [x] Un usuario NO puede desactivarse a sí mismo
- [x] NO se puede desactivar al único administrador del sistema
- [x] Al activar un usuario: recuperá acceso al sistema

---

### 7. Filtros y Búsqueda

- [x] Campo de búsqueda para encontrar usuarios por nombre, DNI o email
- [x] La búsqueda se ejecuta automáticamente después de escribir (con ligero retraso)
- [x] Filtro por rol: Todos, Administrador, Recepcionista
- [x] Filtro por estado: Todos, Activos, Inactivos
- [x] Los filtros se pueden combinar entre sí
- [x] Al cambiar cualquier filtro, la tabla se actualiza automáticamente

---

### 8. Paginación

- [x] Botones de navegación: Primera, Anterior, Siguiente, Última
- [x] Indicador de página actual: "Página X de Y"
- [x] Selector de cantidad de usuarios por página: 10, 25, 50, 100
- [x] Los botones se deshabilitan cuando no hay más páginas
- [x] Se muestra el total de usuarios encontrados

---

### 9. Seguridad

- [x] Solo el gerente puede crear, editar o desactivar usuarios
- [x] Un usuario no puede cambiar su propio rol
- [x] Un usuario no puede desactivarse a sí mismo
- [x] No se puede eliminar al último administrador del sistema
- [x] Todas las acciones quedan registradas para auditoría
- [x] Las contraseñas nunca se muestran en la interfaz

---

### 10. Estilo y Diseño

- [x] Tema oscuro consistente con el resto del sistema (fondo zinc-950)
- [x] Tabla con bordes sutiles y efecto hover en filas
- [x] Badges con colores consistentes por rol y estado
- [x] Botones de acción con colores según propósito (editar=azul, desactivar=rojo, activar=verde)
- [x] Formularios con campos bien espaciados y labels descriptivos
- [x] Mensajes de error claros en español
- [x] Estados de carga con spinner o skeleton mientras se obtienen los datos
