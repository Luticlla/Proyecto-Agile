# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu04-register.spec.ts >> HU-004: Registro de Datos Personales >> CP-10: Contrasenas no coinciden muestra error
- Location: tests/hu04-register.spec.ts:122:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Crear Cuenta")')
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
- generic [ref=e1]:
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
                - text: "12345678"
              - button "Validar" [ref=e18] [cursor=pointer]
          - generic [ref=e19]:
            - generic [ref=e20]:
              - text: Nombre *
              - textbox "Nombre *" [ref=e21]:
                - /placeholder: Valida tu DNI
                - text: Test
            - generic [ref=e22]:
              - text: Apellido *
              - textbox "Apellido *" [ref=e23]:
                - /placeholder: Valida tu DNI
                - text: User
          - generic [ref=e24]:
            - text: Email *
            - textbox "Email *" [ref=e25]:
              - /placeholder: tu@email.com
              - text: test@test.com
          - generic [ref=e26]:
            - text: Teléfono (opcional)
            - generic [ref=e27]:
              - generic [ref=e28]: "+51"
              - textbox "Teléfono (opcional)" [ref=e29]:
                - /placeholder: 999 999 999
          - generic [ref=e30]:
            - text: Fecha de Nacimiento *
            - textbox "Fecha de Nacimiento *" [ref=e31]: 2000-01-01
          - generic [ref=e32]:
            - text: Sexo *
            - combobox [ref=e33] [cursor=pointer]:
              - generic: Masculino
              - img
            - combobox [ref=e34]
          - generic [ref=e35]:
            - text: Contraseña *
            - textbox "Contraseña *" [ref=e36]:
              - /placeholder: Mínimo 8 caracteres, no solo números
              - text: "123456"
            - paragraph [ref=e37]:
              - img [ref=e38]
              - text: La contraseña debe tener al menos 8 caracteres
          - generic [ref=e42]:
            - text: Confirmar Contraseña *
            - textbox "Confirmar Contraseña *" [active] [ref=e43]:
              - /placeholder: ••••••••
              - text: "654321"
            - paragraph [ref=e44]:
              - img [ref=e45]
              - text: Las contraseñas no coinciden
          - paragraph [ref=e49]: "Para activar el registro: valida tu DNI con RENIEC, completa todos los campos y asegúrate de que las contraseñas coincidan."
          - button "Crear Cuenta" [disabled]
        - generic [ref=e50]:
          - text: ¿Ya tienes cuenta?
          - link "Inicia sesión aquí" [ref=e51] [cursor=pointer]:
            - /url: /login
  - button "Open Next.js Dev Tools" [ref=e57] [cursor=pointer]:
    - img [ref=e58]
  - alert [ref=e61]
```

# Test source

```ts
  24  |  * restantes. Necesario para cualquier test que dependa de poder hacer
  25  |  * click en el submit real, ya que este permanece disabled hasta que
  26  |  * `reniecValidado` sea true.
  27  |  */
  28  | async function completarFormularioValido(page: Page, opts?: { password?: string; confirm?: string }) {
  29  |   await page.route('**/api/reniec/public**', route =>
  30  |     route.fulfill({
  31  |       status: 200,
  32  |       contentType: 'application/json',
  33  |       body: JSON.stringify({ nombre: 'Test', apellido: 'User', dni: '12345678' })
  34  |     })
  35  |   )
  36  |  
  37  |   await page.locator('#dni').fill('12345678')
  38  |   await page.locator('button:has-text("Validar")').click()
  39  |   await expect(page.getByText(/validado con reniec/i)).toBeVisible()
  40  |  
  41  |   await page.locator('input[type="email"]').fill('test@test.com')
  42  |   await page.locator('#fecha_nacimiento').fill('2000-01-01')
  43  |  
  44  |   const trigger = page.locator('[data-slot="select-trigger"]').first()
  45  |   if (await trigger.isVisible()) {
  46  |     await trigger.click()
  47  |     await page.getByRole('option', { name: 'Masculino' }).click()
  48  |   }
  49  |  
  50  |   const pwd = opts?.password || 'test1234'
  51  |   const conf = opts?.confirm || 'test1234'
  52  |   await page.locator('#password').fill(pwd)
  53  |   await page.locator('#confirmPassword').fill(conf)
  54  | }
  55  |  
  56  | test.describe('HU-004: Registro de Datos Personales', () => {
  57  |   test.beforeEach(async ({ page }) => {
  58  |     await page.goto('/register', { waitUntil: 'networkidle', timeout: 30000 })
  59  |   })
  60  | 
  61  |   test('CP-01: Formulario de registro carga correctamente', async ({ page }) => {
  62  |     await expect(page).toHaveURL('/register')
  63  |     await expect(page.locator('text="Crear Cuenta"').first()).toBeVisible()
  64  |   })
  65  | 
  66  |   test('CP-02: Campo Nombre obligatorio', async ({ page }) => {
  67  |     const nombre = page.locator('#nombre')
  68  |     await expect(nombre).toBeVisible()
  69  |     expect(await nombre.getAttribute('required')).not.toBeNull()
  70  |   })
  71  | 
  72  |   test('CP-03: Campo Apellido obligatorio', async ({ page }) => {
  73  |     const apellido = page.locator('#apellido')
  74  |     await expect(apellido).toBeVisible()
  75  |     expect(await apellido.getAttribute('required')).not.toBeNull()
  76  |   })
  77  | 
  78  |   test('CP-04: Campo DNI con pattern numerico de 8 digitos', async ({ page }) => {
  79  |     const dni = page.locator('#dni')
  80  |     await expect(dni).toBeVisible()
  81  |     expect(await dni.getAttribute('maxLength')).toBe('8')
  82  |     expect(await dni.getAttribute('pattern')).toBe('[0-9]{8}')
  83  |   })
  84  | 
  85  |   test('CP-05: Validacion DNI con menos de 8 digitos', async ({ page }) => {
  86  |     const dni = page.locator('#dni')
  87  |     await dni.fill('1234')
  88  |     const isValid = await dni.evaluate((el: HTMLInputElement) => el.validity.valid)
  89  |     expect(isValid).toBeFalsy()
  90  |   })
  91  | 
  92  |   test('CP-06: Campo Email con validacion type=email', async ({ page }) => {
  93  |     const email = page.locator('input[type="email"]')
  94  |     await expect(email).toBeVisible()
  95  |     await email.fill('correo-invalido')
  96  |     const isValid = await email.evaluate((el: HTMLInputElement) => el.validity.valid)
  97  |     expect(isValid).toBeFalsy()
  98  |   })
  99  | 
  100 |   test('CP-07: Campo Telefono es opcional', async ({ page }) => {
  101 |     const telefono = page.locator('#telefono, input[name="telefono"]')
  102 |     await expect(telefono.first()).toBeVisible()
  103 |     const required = await telefono.first().getAttribute('required')
  104 |     expect(required).toBeNull()
  105 |   })
  106 | 
  107 |   test('CP-08: Campo Telefono tiene placeholder', async ({ page }) => {
  108 |     const telefono = page.locator('#telefono, input[name="telefono"]')
  109 |     await expect(telefono.first()).toBeVisible()
  110 |     const placeholder = await telefono.first().getAttribute('placeholder')
  111 |     expect(placeholder).toBeTruthy()
  112 |   })
  113 | 
  114 |   test('CP-09: Password con menos de 6 caracteres muestra error', async ({ page }) => {
  115 |     await fillRequiredFields(page, { password: '123', confirm: '123' })
  116 |     await page.locator('button:has-text("Crear Cuenta")').click()
  117 |     await page.waitForTimeout(500)
  118 |     const error = page.getByText(/al menos 6 caracteres|6 caracteres|contraseña debe tener/i)
  119 |     await expect(error.first()).toBeVisible()
  120 |   })
  121 | 
  122 |   test('CP-10: Contrasenas no coinciden muestra error', async ({ page }) => {
  123 |     await fillRequiredFields(page, { password: '123456', confirm: '654321' })
> 124 |     await page.locator('button:has-text("Crear Cuenta")').click()
      |                                                           ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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
  224 |     await page.locator('button[type="submit"]').click()
```