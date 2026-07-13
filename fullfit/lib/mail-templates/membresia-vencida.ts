export function getMembresiaVencidaEmail(
  userName: string,
  planNombre: string,
  fechaFin: string,
  fechaInicio: string
) {
  const currentYear = new Date().getFullYear()

  const [y, m, d] = fechaFin.split('-')
  const fechaFormateada = `${d}/${m}/${y}`

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tu membresía ha vencido - FULLFORMA</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0a0a0a; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="400" cellpadding="0" cellspacing="0" style="background:#18181b; border-radius:12px; border:1px solid #27272a; overflow:hidden;">
              <!-- Header -->
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#facc15 0%,#eab308 100%); padding:32px 40px;">
                  <h1 style="margin:0; color:#000; font-size:28px; font-weight:800; letter-spacing:2px;">FULLFORMA</h1>
                  <p style="margin:4px 0 0 0; color:#18181b; font-size:12px; letter-spacing:1px;">GYM & FITNESS</p>
                </td>
              </tr>
              <!-- Contenido -->
              <tr>
                <td style="padding:40px;">
                  <p style="color:#fafafa; font-size:16px; line-height:1.6; margin:0 0 16px 0;">
                    Hola <strong style="color:#facc15;">${userName}</strong>
                  </p>
                  <p style="color:#a1a1aa; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
                    Tu membresía <strong style="color:#fafafa;">${planNombre}</strong> ha vencido el <strong style="color:#facc15;">${fechaFormateada}</strong>.
                  </p>
                  <p style="color:#a1a1aa; font-size:14px; line-height:1.6; margin:0 0 24px 0;">
                    Ya no tienes acceso activo al gimnasio. ¡Renueva hoy y sigue entrenando!
                  </p>
                  <!-- Botón -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:8px 0 8px 0;">
                        <a href="https://fullforma.vercel.app/mi-membresia"
                           style="display:inline-block; background:#facc15; color:#000;
                                  padding:14px 40px; text-decoration:none; border-radius:8px;
                                  font-weight:bold; font-size:15px; letter-spacing:0.5px;">
                          Renovar Membresía
                        </a>
                      </td>
                    </tr>
                  </table>
                  <!-- Advertencia -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f11; border-radius:8px; border:1px solid #27272a; margin-top:24px;">
                    <tr>
                      <td style="padding:16px;">
                        <p style="color:#71717a; font-size:12px; line-height:1.5; margin:0;">
                          Si ya realizaste el pago, ignora este mensaje. El acceso se restablecerá automáticamente.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="background:#0f0f11; padding:24px 40px; border-top:1px solid #27272a;">
                  <p style="color:#52525b; font-size:11px; margin:0;">
                    © ${currentYear} FULLFORMA — Todos los derechos reservados
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
