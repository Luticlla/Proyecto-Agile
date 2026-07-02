# HU-011: Gestión de Sedes del Gimnasio

## Historia de Usuario
**Como** Gerente,
**Quiero** registrar y administrar las sedes del gimnasio,
**Para** que la información mostrada a los socios en la web esté siempre actualizada.

## Estado
✅ Implementada

## Criterios de Aceptación

---

### 1. Acceso y Permisos

- [x] Solo el gerente puede crear, editar o desactivar sedes
- [x] Si un recepcionista intenta acceder, se le redirige a su área de trabajo
- [x] Si un miembro intenta acceder, se le redirige a la página principal
- [x] Los usuarios no autenticados van al login
- [x] Sedes inactivas no aparecen en la página pública para socios

---

### 2. Panel de Gestión

- [x] Existe una sección "Sedes" en la navegación del gerente
- [x] Título: "Gestión de Sedes" con subtítulo "Administra las sedes del gimnasio"
- [x] Botón "Nueva Sede" para agregar
- [x] Tabla con todas las sedes (activas e inactivas)

---

### 3. Tabla de Sedes

**Columnas de la tabla:**
- [x] **Nombre:** nombre de la sede
- [x] **Dirección:** dirección completa
- [x] **Teléfono:** número de contacto
- [x] **Email:** correo electrónico
- [x] **Estado:** badge verde (Activa) o rojo (Inactiva)
- [x] **Horario LV:** horario de lunes a viernes
- [x] **Horario Sáb:** horario de sábado
- [x] **Acciones:** Editar, Desactivar/Activar

---

### 4. Crear Sede

- [x] Al hacer clic en "Nueva Sede" se abre un formulario
- [x] Campos: Nombre*, Dirección*, Teléfono*, Email*, Horarios LV*, Horario Sáb*
- [x] Campos opcionales: Imagen (upload), Latitud, Longitud
- [x] Valores por defecto: apertura 06:00, cierre 22:00 (LV); apertura 07:00, cierre 22:00 (Sáb)
- [x] Validaciones: nombre único, dirección única, email válido, apertura < cierre
- [x] Upload de imagen: máximo 5MB, formatos jpg/png/webp, preview antes de subir
- [x] La imagen se sube al almacenamiento del sistema y se guarda la URL
- [x] Al éxito: mensaje de confirmación y se actualiza la tabla
- [x] Si hay error (nombre duplicado, email duplicado): mensaje claro en español

---

### 5. Editar Sede

- [x] Botón "Editar" abre formulario con datos existentes
- [x] Todos los campos son editables
- [x] La imagen se puede cambiar (se elimina la anterior)
- [x] La dirección única se valida excluyendo la sede actual
- [x] Spinner durante la actualización

---

### 6. Desactivar y Activar Sede

- [x] Botón "Desactivar" (activas) / "Activar" (inactivas)
- [x] Modal de confirmación: "¿Desactivar sede [Nombre]?"
- [x] Advertencia: "Esta sede no aparecerá en la página pública para socios"
- [x] Al confirmar: cambia estado y se actualiza la tabla
- [x] Al activar: recuperá visibilidad en la página pública
- [x] Un usuario no puede desactivarse a sí mismo

---

### 7. Página Pública (verificación)

- [x] Solo muestra sedes con estado "activa"
- [x] Muestra imagen, nombre, dirección, teléfono, horarios
- [x] Link a Google Maps con coordenadas
- [x] Si no hay sedes activas, muestra "Próximamente"

---

### 8. Filtros y Búsqueda

- [x] Campo de búsqueda por nombre o dirección
- [x] Filtro por estado: Todas, Activas, Inactivas
- [x] Búsqueda automática con ligero retraso
- [x] Filtros combinables entre sí

---

### 9. Seguridad

- [x] Solo el gerente puede crear, editar o desactivar sedes
- [x] Las sedes inactivas no se muestran al público
- [x] Las imágenes se almacenan de forma segura
- [x] Todas las acciones quedan registradas
- [x] Los datos públicos (solo lectura) no requieren autenticación

---

### 10. Estilo y Diseño

- [x] Tema oscuro consistente con el resto del admin (fondo zinc-950)
- [x] Tabla con bordes sutiles y efecto hover
- [x] Badges de estado con colores consistentes
- [x] Formularios con campos bien espaciados
- [x] Preview de imagen antes de subir
- [x] Mensajes de error claros en español
