# HU-002: Sedes — Correcciones al CSV

## Discrepancias encontradas entre el CSV y la implementación real

| CP | CSV Dice | Realidad | Acción |
|---|---|---|---|
| CP-07 | "Página de Sedes carga correctamente" | ✅ La página es un Server Component que consulta `supabase.from('sedes').select('*')`. Carga con datos reales desde Supabase. | Sin cambios |
| CP-08 | "Sección de contadores/estadísticas visible" | ✅ La sección de estadísticas existe pero usa un diseño con iconos (edificio, ubicación, reloj 24/7). El CSV espera "Sedas Activas", "Distritos Cubiertos", "24/7 Soporte" — estos textos coinciden. | Sin cambios |
| CP-09 | "Se renderizan tarjetas de sede" | ✅ Las tarjetas se renderizan dinámicamente desde Supabase. Cada una muestra nombre, ubicación y botones de acción. | Sin cambios |
| CP-10 | "Panel de horarios expandible" | ✅ El botón "Ver Más" expande un panel con horarios Lunes a Domingo. Domingo muestra "Cerrado". Botón "Cómo llegar" abre Google Maps en nueva pestaña. | Sin cambios |
| CP-11 | "Enlace a Membresías visible" | ⚠️ El CTA varía según la sección. En algunas secciones dice "Ver Membresías", en otras "Descubre más". | Aceptar variación de texto |
| CP-12 | "Footer visible" | ✅ Footer presente con información de contacto, redes sociales, enlaces legales. | Sin cambios |

## Observaciones adicionales
- Las sedes se cargan desde Supabase con `imagen_url`, `horario` (JSONB), `ubicacion` (Google Maps link), `telefono`.
- Si la tabla `sedes` está vacía en Supabase, no se mostrarán tarjetas (comportamiento correcto).
- No hay estado de carga/error visible porque es un Server Component — la página se renderiza completa en el servidor.
