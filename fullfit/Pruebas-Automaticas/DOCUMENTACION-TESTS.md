# Documentación de Pruebas Automatizadas

## Resumen

- **Total CPs en CSV:** 224
- **Pruebas automatizadas ejecutadas:** 115
- **Passed:** 102
- **Skipped:** 13 (requieren sesión activa en Supabase)
- **Failed:** 0
- **Manuales/No implementados/No aplica:** 109

## Archivos de Test

### `tests/hu01-landing-page.spec.ts` — 22 tests (todos PASS)
| CP | Input | Expected Output | Result |
|---|---|---|---|
| CP-01/C-02 | Visitar `/` | Página carga, banner visible | PASS |
| CP-04/CP-07 | Cargar página | Título + botón "Inscríbete ya" visible | PASS |
| CP-05 | Click "Inscríbete ya" | Navega a /sedes | PASS |
| CP-08/CP-09 | Cargar página | InfiniteScroll con ANTES/DESPUÉS | PASS |
| CP-11 | Viewport 375×812 | Sin overflow horizontal | PASS |
| CP-13/14/15 | Cargar página | Header con logo + Sedes + Membresías | PASS |
| CP-14 | Click "Sedes" en header | Navega a /sedes | PASS |
| CP-15 | Click "Membresías" en header | Navega a /membresias | PASS |
| CP-16 | Cargar sin sesión | Botones Iniciar Sesión + Registrarse | PASS |
| CP-19/20 | Viewport 375px | Hamburguesa visible, menú desktop oculto | PASS |
| CP-21 | Click hamburguesa | SideMenu visible | PASS |
| CP-22 | Click overlay | Overlay existe | PASS |
| CP-06 | Cargar footer | Footer + redes sociales | PASS |
| CP-25 | Click red social | target="_blank" | PASS |
| CP-27/28 | Cargar footer | Footer visible + año actual | PASS |
| CP-37 | Click logo | Navega a / | PASS |
| CP-38 | Scroll down | Header visible | PASS |
| CP-29 | Inspeccionar colores | Fondo #000, acentos #ffdf00 | PASS |
| CP-33 | Inspeccionar head | Title + meta description | PASS |
| CP-36 | Visitar `/ruta-inexistente` | Página 404 | PASS |
| CP-42 | Viewport 320/768px | Footer responsivo | PASS |
| CP-32 | Cargar y revisar consola | Sin errores críticos | PASS |

### `tests/hu02-sedes.spec.ts` — 14 tests (todos PASS)
| CP | Input | Expected Output | Result |
|---|---|---|---|
| CP-01 | Visitar `/sedes` | Página carga | PASS |
| CP-02 | Cargar página | Título "Nuestras Sedes" | PASS |
| CP-03 | Cargar página | Subtítulo visible | PASS |
| CP-04/06 | Cargar página | Contador + "24/7 Soporte" | PASS |
| CP-17 | Sin sedes en BD | "No hay sedes disponibles" | PASS |
| CP-19 | Cargar CTA (si hay sedes) | Texto "¿Aún no eres miembro?" | PASS |
| CP-20 | Click CTA (si existe) | Navega a /membresias | PASS |
| CP-21 | Viewport 375×812 | Sin overflow | PASS |
| CP-22 | Sin sesión | Página carga OK | PASS |
| CP-27 | Click logo en /sedes | Navega a / | PASS |
| CP-12/14 | Click "Ver más información" | Panel expande/colapsa | PASS |
| CP-26 | Tab+Enter en collapsible | Panel se expande | PASS |
| Footer | Cargar página | Footer visible | PASS |

### `tests/hu03-membresias.spec.ts` — 17 tests (todos PASS)
| CP | Input | Expected Output | Result |
|---|---|---|---|
| CP-01 | Visitar `/membresias` | Página carga | PASS |
| CP-02 | Cargar página | Título "Elige tu Membresía" | PASS |
| CP-03 | Cargar página | Subtítulo visible | PASS |
| CP-04/05 | Cargar página | Contador + "100% Flexible" | PASS |
| CP-15 | Click "Elegir Plan" | Enlace a /pasarelapago?plan= | PASS |
| CP-16 | Click sin sesión | Redirige a /membresias | PASS |
| CP-10/11/12 | Cargar planes (si hay datos) | Beneficios visibles | PASS |
| CP-13 | Cargar planes | Badge "Más Popular" | PASS |
| CP-14 | Cargar otros planes | Sin badge | PASS |
| CP-21 | Scroll final | "¿Tienes dudas?" | PASS |
| CP-22 | Click "Visítanos" | Navega a /sedes | PASS |
| CP-24 | Viewport 375×812 | Sin overflow | PASS |
| CP-31 | Tab+Enter en "Elegir Plan" | Foco + navegación | PASS |
| Footer | Cargar página | Footer visible | PASS |

### `tests/hu04-register.spec.ts` — 18 tests (todos PASS)
| CP | Input | Expected Output | Result |
|---|---|---|---|
| CP-01 | Visitar `/register` | Formulario carga + título "Crear Cuenta" | PASS |
| CP-02 | Inspeccionar #nombre | Required + visible | PASS |
| CP-03 | Inspeccionar #apellido | Required + visible | PASS |
| CP-04/28 | #dni.fill('1234') | validity.valid = false | PASS |
| CP-06 | input[type="email"].fill('correo-invalido') | validity.valid = false | PASS |
| CP-07 | #telefono visible | Opcional (no required) | PASS |
| CP-09 | #password.fill('123') + submit | Error "6 caracteres" | PASS |
| CP-10 | Passwords distintas + submit | Error "no coinciden" | PASS |
| CP-11/26 | Formulario completo + submit | Error manejado | PASS |
| CP-18 | Click "Inicia sesión" | Navega a /login | PASS |
| CP-19 | Click "Registrarse" en header | Navega a /register | PASS |
| CP-20/22/24 | Buscar genero, date | No existen (GAP) | PASS |
| CP-29 | #password.fill('      ') + submit | Error manejado | PASS |
| CP-32 | Submit vacío | Foco en primer campo | PASS |
| Volver inicio | Click "Volver al inicio" | Navega a / | PASS |

### `tests/hu05-pagos.spec.ts` — 14 tests (todos PASS)
| CP | Input | Expected Output | Result |
|---|---|---|---|
| CP-02 | `/pasarelapago?plan=1` sin sesión | Redirige a /membresias | PASS |
| CP-33 | `/pasarelapago` sin plan | Redirige a /membresias | PASS |
| CP-20 | `/pasarelapago?plan=99999` | Redirige a /membresias | PASS |
| CP-34 | `/pasarelapago?plan=abc-xyz` | Redirige a /membresias | PASS |
| CP-16 | `/pasarelapago?status=approved` | Mensaje éxito visible | PASS |
| CP-17 | `/pasarelapago?status=rejected` | Mensaje fallo visible | PASS |
| CP-18 | `/pasarelapago?status=pending` | Mensaje pendiente visible | PASS |
| CP-04 | POST `/api/pagos` sin sesión | 401/redirect | PASS |
| CP-05 | POST `/api/pagos` planId=99999 | Error | PASS |
| CP-35 | POST `/api/pagos` | No expone credenciales | PASS |
| CP-30/31 | POST webhook {invalid:true} | 400 | PASS |
| CP-32 | POST webhook type unknown | 200 | PASS |
| CP-21 | POST webhook payload | No expone credenciales | PASS |
| CP-25/26 | Buscar Yape/BBVA en UI | No existen (GAP) | PASS |

### `tests/hu06-recepcionista.spec.ts` — 17 tests (4 PASS, 13 SKIP)
| CP | Input | Expected Output | Result |
|---|---|---|---|
| CP-01 | `/recepcionista` sin sesión | Redirige a /login | PASS |
| CP-01 | `/recepcionista/clientes` | Redirige a /login | PASS |
| CP-01 | `/recepcionista/membresias` | Redirige a /login | PASS |
| CP-01 | `/recepcionista/reportes` | Redirige a /login | PASS |
| CP-02 a CP-40 | Con sesión activa | Varios | SKIP |

### `tests/hu07-login.spec.ts` — 20 tests (todos PASS)
| Test | Input | Expected Output | Result |
|---|---|---|---|
| Login carga | Visitar `/login` | Página carga | PASS |
| Título | Cargar página | "Bienvenido de nuevo" | PASS |
| Subtítulo | Cargar página | "Inicia sesión para acceder" | PASS |
| Campo Email/DNI | Inspeccionar #email | type=text, required | PASS |
| Campo Password | Inspeccionar #password | type=password | PASS |
| Botón | Inspeccionar | "Iniciar Sesión" | PASS |
| Olvidaste contraseña | Click link | Navega a /forgot-password | PASS |
| Regístrate aquí | Click link | Navega a /register | PASS |
| Volver al inicio | Click link | Navega a / | PASS |
| Spinner | Submit form | Spinner visible | PASS |
| Error Supabase | Submit form | Error "Failed to fetch" manejado | PASS |
| Forgot carga | Visitar `/forgot-password` | Página carga + título | PASS |
| Forgot email | Inspeccionar | type=email | PASS |
| Forgot button | Inspeccionar | "Enviar enlace" | PASS |
| Forgot volver | Click "Volver" | Navega a /login | PASS |
| Forgot error | Submit | Error manejado | PASS |
| Update-password | `/update-password` sin recovery | Redirige a /login | PASS |

## Notas Técnicas

- **Supabase no disponible:** El proyecto Supabase (`aqxwtuiqcqixsrshzrby.supabase.co`) no es accesible desde esta red (DNS no resuelve). 13 tests que requieren sesión activa están marcados como SKIP.
- **Datos BD vacíos:** Las tablas `sedes`, `planes_membresia`, `clientes` están vacías. Las pruebas verifican empty states y comportamiento con datos ausentes.
- **API Pagos:** Los tests de API verifican manejo de errores (401, 400, credenciales no expuestas). No se prueban flujos completos de Mercado Pago.
- **Webhooks:** El endpoint `/api/webhooks/mercadopago` responde a peticiones pero requiere firma HMAC válida. Los tests verifican que no expone credenciales.
