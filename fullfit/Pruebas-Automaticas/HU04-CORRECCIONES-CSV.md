# HU-004: Registro de Usuario — Correcciones al CSV

## Discrepancias encontradas entre el CSV y la implementación real

| CP | CSV Dice | Realidad | Acción |
|---|---|---|---|
| CP-19 | "Página de Registro carga correctamente" | ✅ Página Client Component con formulario. Muestra título "Crear Cuenta". | Sin cambios |
| CP-20 | "Formulario tiene campos requeridos" | ✅ Campos: DNI, Correo electrónico, Contraseña, Confirmar Contraseña, + Checkbox términos. | Sin cambios |
| CP-21 | "Validación de DNI" | ✅ DNI validado: 8 dígitos numéricos exactos. Error si < 8 o contiene letras. | Sin cambios |
| CP-22 | "Validación de Email" | ✅ Validación de formato de email con mensaje de error si es inválido. | Sin cambios |
| CP-23 | "Validación de Contraseña" | ✅ Contraseña mínimo 6 caracteres. | Sin cambios |
| CP-24 | "Confirmación de Contraseña" | ✅ Validación de que ambas contraseñas coinciden. | Sin cambios |
| CP-25 | "Enlaces de navegación" | ✅ "¿Ya tienes cuenta? Inicia sesión" → /login. "Volver al inicio" → /. | Sin cambios |

## Observaciones adicionales
- El formulario incluye un checkbox de "Acepto los términos y condiciones y las políticas de privacidad" (requerido).
- Usa `react-hook-form` + `zod` para validación.
- Toggle de visibilidad de contraseña implementado con icono de ojo.
- Tras registro exitoso: muestra alerta de éxito y redirige a `/login` tras 3 segundos.
- No se requiere verificación de email (confirmación automática).
