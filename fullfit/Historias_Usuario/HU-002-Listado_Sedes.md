# HU-002: Listado de Sedes

## Historia de Usuario
**Como** Socio (visitante),
**Quiero** ver el listado de sedes del gimnasio,
**Para** inscribirme en la más cercana a mi ubicación.

## Estado
✅ Implementada

## Criterios de Aceptación

### 1. Hero Section
- [x] Título "Nuestras Sedes" con "Sedes" resaltado en amarillo (#ffdf00)
- [x] Subtítulo: "Múltiples puntos de entrenamiento en Trujillo"
- [x] Contador dinámico del número de sedes activas (consultado desde BD)
- [x] Indicador "24/7 Soporte"

### 2. Tarjetas de Sedes (SedesClient)
- [x] Cada sede muestra: imagen (o ícono Dumbbell por defecto), nombre, dirección, teléfono (clicable `tel:`), horario Lun-Vie
- [x] Botón "Ver más información" expande panel con horarios detallados (Lun-Vie, Sábado, Domingo "Cerrado")
- [x] Botón "Cómo llegar" abre Google Maps con latitud/longitud (solo si la sede tiene coordenadas)
- [x] Si no hay sedes activas: mensaje "No hay sedes disponibles en este momento"

### 3. Sección CTA
- [x] Texto: "¿Aún no eres miembro? Una membresía, todas las sedes"
- [x] Botón "Ver Membresías" enlaza a `/membresias`

### 4. Formato de Horarios
- [x] Horarios en formato 12h (ej: "8:00 am – 10:00 pm")
- [x] Domingos muestran "Cerrado" en rojo

## Datos de BD (tabla `sedes`)
- id, nombre, direccion, latitud, longitud, telefono, email
- imagen_url, apertura_lv, cierre_lv, apertura_sab, cierre_sab
- estado ('activa' | 'inactiva')

## Archivos Relacionados
- `app/(marketing)/sedes/page.tsx`
- `components/features/sedes/SedesClient.tsx`
- `lib/supabase/server.ts` (createAnonServerClient)
