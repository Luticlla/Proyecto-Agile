# HU-001: Landing Page — Correcciones al CSV

## Discrepancias encontradas entre el CSV y la implementación real

| CP | CSV Dice | Realidad | Acción |
|---|---|---|---|
| CP-01 | "Página principal carga correctamente" | ✅ Implementado con Server Components. Hero con logo/texto "FullFit", subtítulo descriptivo, imagen de fondo. | Sin cambios |
| CP-02 | "Botón Comenzar redirige a Membresías" | ✅ Botón "Comenzar" o "Empieza Hoy" presente en hero, enlaza a `/membresias`. | Sin cambios |
| CP-03 | "Navbar con enlaces Inicio, Sedes, Membresías" | ✅ Navbar presente con enlaces y logo. Incluye también botón "Iniciar Sesión" y "Registrarse". | Sin cambios |
| CP-04 | "Testimonios visibles en sección dedicada" | ✅ Sección "Lo que dicen nuestros clientes" visible con tarjetas de testimonio. | Sin cambios |
| CP-05 | "CTA final 'Únete' / 'Empieza Hoy'" | ✅ Sección final con título y enlace a Membresías. | Sin cambios |
| CP-06 | "Footer con enlaces y contacto" | ✅ Footer presente con enlaces legales, redes sociales, información de contacto. | Sin cambios |

## Observaciones adicionales
- La landing page es completamente Server Component, sin estados de carga visibles.
- Los testimonios son datos estáticos (mock data), no vienen de Supabase.
- Los beneficios ("¿Por qué FullFit?") se renderizan con iconos de lucide-react (svg inline).
- La navegación usa Next.js `<Link>` para transiciones client-side.
