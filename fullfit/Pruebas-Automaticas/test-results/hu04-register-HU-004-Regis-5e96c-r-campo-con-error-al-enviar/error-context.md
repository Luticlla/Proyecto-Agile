# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu04-register.spec.ts >> HU-004: Registro de Datos Personales >> CP-32: Foco en primer campo con error al enviar
- Location: tests/hu04-register.spec.ts:223:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button[type="submit"]')
    - locator resolved to <button disabled type="submit" data-slot="button" data-size="default" data-variant="default" title="Completa todos los campos y valida tu DNI" class="group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none aria-invalid:borde…>Crear Cuenta</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - link "Volver al inicio" [ref=e4] [cursor=pointer]:
      - /url: /
      - img [ref=e5]
      - generic [ref=e7]: Volver al inicio
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: Crear Cuenta
        - generic [ref=e11]: Únete a Full Forma y alcanza tus metas
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e15]: DNI *
            - generic [ref=e16]:
              - textbox "DNI *" [ref=e17]:
                - /placeholder: "12345678"
              - button "Validar" [disabled]
          - generic [ref=e18]:
            - generic [ref=e19]:
              - text: Nombre *
              - textbox "Nombre *" [ref=e20]:
                - /placeholder: Valida tu DNI
            - generic [ref=e21]:
              - text: Apellido *
              - textbox "Apellido *" [ref=e22]:
                - /placeholder: Valida tu DNI
          - generic [ref=e23]:
            - text: Email *
            - textbox "Email *" [ref=e24]:
              - /placeholder: tu@email.com
          - generic [ref=e25]:
            - text: Teléfono (opcional)
            - generic [ref=e26]:
              - generic [ref=e27]: "+51"
              - textbox "Teléfono (opcional)" [ref=e28]:
                - /placeholder: 999 999 999
          - generic [ref=e29]:
            - text: Fecha de Nacimiento *
            - textbox "Fecha de Nacimiento *" [ref=e30]
          - generic [ref=e31]:
            - text: Sexo *
            - combobox [ref=e32] [cursor=pointer]:
              - generic: Selecciona tu sexo
              - img
            - combobox [ref=e33]
          - generic [ref=e34]:
            - text: Contraseña *
            - textbox "Contraseña *" [ref=e35]:
              - /placeholder: Mínimo 8 caracteres, no solo números
          - generic [ref=e36]:
            - text: Confirmar Contraseña *
            - textbox "Confirmar Contraseña *" [ref=e37]:
              - /placeholder: ••••••••
          - paragraph [ref=e38]: "Para activar el registro: valida tu DNI con RENIEC, completa todos los campos y asegúrate de que las contraseñas coincidan."
          - button "Crear Cuenta" [disabled]
        - generic [ref=e39]:
          - text: ¿Ya tienes cuenta?
          - link "Inicia sesión aquí" [ref=e40] [cursor=pointer]:
            - /url: /login
  - button "Open Next.js Dev Tools" [ref=e46] [cursor=pointer]:
    - img [ref=e47]
  - alert [ref=e50]
```

# Test source

```ts
  124 |     await page.locator('button:has-text("Crear Cuenta")').click()
  125 |     await page.waitForTimeout(500)
  126 |     const error = page.getByText(/contraseñas no coinciden|no coinciden/i)
  127 |     await expect(error.first()).toBeVisible()
  128 |   })
  129 | 
  130 |   test('CP-11: Spinner carga al enviar formulario', async ({ page }) => {
  131 |     await fillRequiredFields(page)
  132 |     await page.locator('button[type="submit"]').click()
  133 |     await page.waitForTimeout(500)
  134 |     const spinner = page.getByText(/creando cuenta|cargando/i)
  135 |     const button = page.locator('button[type="submit"]')
  136 |     const isDisabled = await button.isDisabled()
  137 |     expect(isDisabled || await spinner.count() > 0).toBeTruthy()
  138 |   })
  139 | 
  140 |   test('CP-18: Enlace Inicia sesion aqui navega a /login', async ({ page }) => {
  141 |     const link = page.locator('a:has-text("Inicia sesión"), a:has-text("Inicia sesion")')
  142 |     await expect(link).toBeVisible()
  143 |     await link.click()
  144 |     await expect(page).toHaveURL(/login/)
  145 |   })
  146 | 
  147 |   test('CP-19: Header tiene enlace Registrarse a /register', async ({ page }) => {
  148 |     await page.goto('/', { waitUntil: 'networkidle' })
  149 |     const registerLink = page.locator('a[href="/register"], a:has-text("Registrarse")').first()
  150 |     await expect(registerLink).toBeVisible()
  151 |     await registerLink.click()
  152 |     await expect(page).toHaveURL(/register/)
  153 |   })
  154 | 
  155 |   test('CP-20: Campo Genero existe con 3 opciones', async ({ page }) => {
  156 |     const genero = page.locator('[data-slot="select-trigger"]').filter({ hasText: /sexo|género|genero/i }).first()
  157 |     await expect(genero).toBeVisible()
  158 |   })
  159 | 
  160 |   test('CP-22: Campo Fecha Nacimiento existe con date picker', async ({ page }) => {
  161 |     const fecha = page.locator('#fecha_nacimiento, input[type="date"], [name="fecha_nacimiento"]')
  162 |     await expect(fecha.first()).toBeVisible()
  163 |   })
  164 | 
  165 |   test('CP-25: Toggle visibilidad de contrasena', async ({ page }) => {
  166 |     const passwordInput = page.locator('#password')
  167 |     await expect(passwordInput).toBeVisible()
  168 |     const initialType = await passwordInput.getAttribute('type')
  169 |     expect(initialType).toBe('password')
  170 |   })
  171 | 
  172 |   test('CP-26: Boton deshabilitado mientras envia', async ({ page }) => {
  173 |     await page.route('**/auth/v1/signup', route => new Promise(() => {}))
  174 |     await completarFormularioValido(page)
  175 |     await page.locator('button[type="submit"]').click()
  176 |     await page.waitForTimeout(500)
  177 |     const button = page.locator('button[type="submit"]')
  178 |     const isDisabled = await button.isDisabled()
  179 |     expect(isDisabled).toBeTruthy()
  180 |   })
  181 | 
  182 |   test('CP-27: Error de red signUp manejado', async ({ page }) => {
  183 |     await page.route('**/auth/v1/signup', route => route.abort('connectionrefused'))
  184 |     await completarFormularioValido(page)
  185 |     await page.locator('button[type="submit"]').click()
  186 |     await page.waitForTimeout(2000)
  187 |     await expect(page).toHaveURL(/register/)
  188 |   })
  189 | 
  190 |   test('CP-28: DNI con caracteres no numericos bloqueado', async ({ page }) => {
  191 |     const dni = page.locator('#dni')
  192 |     await dni.fill('12AB3456')
  193 |     await expect(dni).toHaveValue('123456')
  194 |     const isValid = await dni.evaluate((el: HTMLInputElement) => el.validity.valid)
  195 |     expect(isValid).toBeFalsy()
  196 |   })
  197 | 
  198 |   test('CP-29: Contrasena con solo espacios rechazada', async ({ page }) => {
  199 |     await fillRequiredFields(page, { password: '  ', confirm: '  ' })
  200 |     await page.locator('button[type="submit"]').click()
  201 |     await page.waitForTimeout(500)
  202 |     const error = page.getByText(/al menos 6 caracteres/i)
  203 |     await expect(error.first()).toBeVisible()
  204 |   })
  205 | 
  206 |   test('CP-30: Telefono solo acepta digitos empieza con 9', async ({ page }) => {
  207 |     const telefono = page.locator('#telefono, input[name="telefono"]')
  208 |     await expect(telefono.first()).toBeVisible()
  209 |     const inputMode = await telefono.first().getAttribute('inputmode')
  210 |     expect(inputMode).toBe('numeric')
  211 |   })
  212 | 
  213 |   test('CP-31: Prevenir doble clic en Crear Cuenta', async ({ page }) => {
  214 |     await page.route('**/auth/v1/signup', route => new Promise(() => {}))
  215 |     await completarFormularioValido(page)
  216 |     const button = page.locator('button[type="submit"]')
  217 |     await button.click()
  218 |     await page.waitForTimeout(500)
  219 |     const isDisabled = await button.isDisabled()
  220 |     expect(isDisabled).toBeTruthy()
  221 |   })
  222 | 
  223 |   test('CP-32: Foco en primer campo con error al enviar', async ({ page }) => {
> 224 |     await page.locator('button[type="submit"]').click()
      |                                                 ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  225 |     await page.waitForTimeout(300)
  226 |     const focused = await page.evaluate(() => {
  227 |       const el = document.activeElement
  228 |       return el ? el.id : null
  229 |     })
  230 |     expect(focused).toBeTruthy()
  231 |   })
  232 | 
  233 |   test('CP-33: Campo Genero funcional con 3 opciones', async ({ page }) => {
  234 |     const trigger = page.locator('[data-slot="select-trigger"]').filter({ hasText: /sexo|género|genero/i }).first()
  235 |     await expect(trigger).toBeVisible()
  236 |     await trigger.click()
  237 |     const options = page.locator('[role="option"]')
  238 |     const count = await options.count()
  239 |     expect(count).toBeGreaterThanOrEqual(3)
  240 |   })
  241 | 
  242 |   test('CP-34: Campo Fecha Nacimiento funcional con restricciones', async ({ page }) => {
  243 |     const fecha = page.locator('#fecha_nacimiento, input[type="date"], [name="fecha_nacimiento"]')
  244 |     await expect(fecha.first()).toBeVisible()
  245 |     const min = await fecha.first().getAttribute('min')
  246 |     const max = await fecha.first().getAttribute('max')
  247 |     expect(min || max).toBeTruthy()
  248 |   })
  249 | })
  250 |  
```