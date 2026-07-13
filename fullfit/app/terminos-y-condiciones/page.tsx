import { ArrowLeft, Scale, Shield, CreditCard, UserX, AlertTriangle, FileText, MapPin, Clock, RefreshCw, Users, Pencil, RotateCcw, Ban, Heart, Phone, ChevronRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata = {
  title: 'Términos y Condiciones | FULLFORMA',
  description: 'Términos y Condiciones de Membresía de FULLFORMA - Enterprise Fitness Elite S.A.C.',
}

const clauses = [
  { id: '1', title: 'Identificación de las Partes', icon: Scale },
  { id: '2', title: 'Objeto del Contrato', icon: FileText },
  { id: '3', title: 'Definiciones', icon: FileText },
  { id: '4', title: 'Requisitos de Afiliación', icon: Users },
  { id: '5', title: 'Planes y Precios', icon: CreditCard },
  { id: '6', title: 'Formas de Pago', icon: CreditCard },
  { id: '7', title: 'Comprobantes de Pago', icon: FileText },
  { id: '8', title: 'Pago por Terceros', icon: Ban },
  { id: '9', title: 'Vigencia y Renovación', icon: Clock },
  { id: '10', title: 'Una Sola Membresía', icon: UserX },
  { id: '11', title: 'Cambio de Plan', icon: RefreshCw },
  { id: '12', title: 'Transferencia de Membresía', icon: Users },
  { id: '13', title: 'Actualización de Datos', icon: Pencil },
  { id: '14', title: 'Devoluciones y Reembolsos', icon: Ban },
  { id: '15', title: 'Cancelación de Membresía', icon: AlertTriangle },
  { id: '16', title: 'Motivos de Cancelación', icon: Shield },
  { id: '17', title: 'Conservación de Datos', icon: ShieldCheck },
  { id: '18', title: 'Suspensión Temporal', icon: Clock },
  { id: '19', title: 'Uso de Instalaciones', icon: Heart },
  { id: '20', title: 'Menores de Edad', icon: Ban },
  { id: '21', title: 'Responsabilidad y Salud', icon: Heart },
  { id: '22', title: 'Protección de Datos', icon: ShieldCheck },
  { id: '23', title: 'Modificaciones', icon: FileText },
  { id: '24', title: 'Legislación y Jurisdicción', icon: Scale },
  { id: '25', title: 'Disposiciones Finales', icon: FileText },
]

export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative border-b border-gym-logo/20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,223,0,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,223,0,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-12 relative z-10">
          <Link href="/register" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 hoverEffect w-fit">
            <ArrowLeft className="size-4" />
            <span className="font-arcade text-[10px]">Volver al registro</span>
          </Link>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 md:w-16 bg-gym-logo" />
              <span className="font-arcade text-gym-logo text-[8px] md:text-[10px] tracking-widest uppercase">
                Documento Legal
              </span>
              <div className="h-px w-8 md:w-16 bg-gym-logo" />
            </div>

            <h1 className="font-arcade text-white text-lg md:text-2xl lg:text-3xl tracking-wide uppercase leading-relaxed">
              Términos y{' '}
              <span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">
                Condiciones
              </span>
            </h1>

            <p className="text-white/50 text-xs md:text-sm max-w-lg leading-relaxed font-mono">
              Enterprise Fitness Elite S.A.C. — <span className="text-gym-logo/80">FULLFORMA</span>
            </p>

            <div className="flex items-center gap-6 mt-2 pt-4 border-t border-white/10">
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-sm md:text-lg">25</span>
                <span className="text-white/30 text-[8px] font-arcade uppercase tracking-wider">Cláusulas</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-sm md:text-lg">RUC</span>
                <span className="text-white/30 text-[8px] font-arcade uppercase tracking-wider">20482468692</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-sm md:text-lg">2026</span>
                <span className="text-white/30 text-[8px] font-arcade uppercase tracking-wider">Vigente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Índice lateral - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="font-arcade text-[10px] text-gym-logo tracking-widest uppercase mb-4">
                Índice de Cláusulas
              </h3>
              <nav className="space-y-1">
                {clauses.map((clause) => (
                  <a
                    key={clause.id}
                    href={`#clausula-${clause.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xs group"
                  >
                    <clause.icon className="size-3 text-zinc-600 group-hover:text-gym-logo transition-colors" />
                    <span className="font-mono">
                      <span className="text-zinc-600 mr-1">{clause.id}.</span>
                      {clause.title}
                    </span>
                    <ChevronRight className="size-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Contenido */}
          <main className="flex-1 min-w-0">
            <Accordion type="multiple" className="space-y-3">

              {/* CLÁUSULA 1 */}
              <AccordionItem value="1" id="clausula-1" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Scale className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 1: IDENTIFICACIÓN DE LAS PARTES
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">1.1.</strong> El presente Acuerdo de Membresía (en adelante, el &quot;Acuerdo&quot;) se celebra entre:</p>
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 space-y-2">
                      <p><strong className="text-white">EL GIMNASIO:</strong> ENTERPRISE FITNESS ELITE S.A.C., persona jurídica de derecho privado, constituida conforme a las leyes de la República del Perú, inscrita en los Registros Públicos, con RUC N° 20482468692, con domicilio social en Jr. Bolognesi N° 231, 2do piso, distrito de Trujillo, provincia de Trujillo, departamento de La Libertad, Perú. En adelante denominada <strong className="text-gym-logo">&quot;FULLFORMA&quot;</strong>.</p>
                      <p><strong className="text-white">EL SOCIO:</strong> La persona natural mayor de edad que suscribe el presente Acuerdo, cuyos datos personales constan en el formulario de registro del sistema informático de FULLFORMA, y que en adelante se denominará <strong className="text-gym-logo">&quot;EL SOCIO&quot;</strong>.</p>
                    </div>
                    <p><strong className="text-white">1.2.</strong> Ambas partes en adelante denominadas indistintamente como &quot;la Parte&quot; o colectivamente como &quot;las Partes&quot;.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 2 */}
              <AccordionItem value="2" id="clausula-2" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 2: OBJETO DEL CONTRATO
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">2.1.</strong> EL GIMNASIO se obliga a brindar a EL SOCIO el servicio integral de acondicionamiento físico y preparación deportiva, el cual incluye acceso a las instalaciones deportivas, uso de equipamiento, acceso a áreas comunes y los demás beneficios correspondientes al plan de membresía adquirido.</p>
                    <p><strong className="text-white">2.2.</strong> Los servicios se prestarán exclusivamente en la sede de FULLFORMA ubicada en:</p>
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <MapPin className="size-4 text-gym-logo" />
                        <span className="text-white font-semibold text-sm">Jr. Bolognesi N° 231, 2do piso, Trujillo, La Libertad, Perú.</span>
                      </div>
                    </div>
                    <p><strong className="text-white">2.3.</strong> FULLFORMA no está obligada a prestar servicios en ubicaciones distintas a la señalada en el presente contrato, salvo que así lo disponga expresamente por escrito.</p>
                    <p><strong className="text-white">2.4.</strong> El servicio incluye las instalaciones y áreas descritas para cada plan de membresía, conforme se detalla en la Cláusula 5 del presente Acuerdo.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 3 */}
              <AccordionItem value="3" id="clausula-3" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 3: DEFINICIONES
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-2 text-sm leading-relaxed pl-11">
                    <p>Para efectos del presente Acuerdo, se establecen las siguientes definiciones:</p>
                    <ul className="space-y-2 mt-3">
                      {[
                        ['"Membresía"', 'El derecho de acceso y uso de las instalaciones y servicios de FULLFORMA, asociado a un plan específico, por un plazo determinado.'],
                        ['"Plan"', 'La modalidad de servicio contratada por EL SOCIO, la cual determina la duración, el precio y los beneficios incluidos.'],
                        ['"Sistema"', 'La plataforma informática de FULLFORMA, accesible vía web en la dirección fullforma.vercel.app.'],
                        ['"Socio"', 'Toda persona natural mayor de edad que haya completado el proceso de registro y adquirido una membresía vigente.'],
                        ['"Recepcionista"', 'El personal de atención al cliente de FULLFORMA, autorizado para realizar operaciones de registro, pago, renovación y gestión de membresías.'],
                        ['"Boleta de Venta Electrónica"', 'El comprobante de pago emitido por FULLFORMA conforme a la normativa tributaria vigente.'],
                        ['"Periodo de Renovación"', 'El lapso de siete (7) días calendario previos al vencimiento de la membresía.'],
                        ['"Fecha de Vencimiento"', 'La fecha límite de vigencia de la membresía.'],
                      ].map(([term, def], i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-gym-logo font-semibold shrink-0">{term}</span>
                          <span>: {def}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 4 */}
              <AccordionItem value="4" id="clausula-4" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Users className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 4: REQUISITOS DE AFILIACIÓN
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <div className="bg-gym-logo/10 border border-gym-logo/30 rounded-lg p-4 my-4">
                      <p className="text-gym-logo font-bold text-center text-sm">SOLO PERSONAS CON DNI PUEDEN REGISTRARSE Y ADQUIRIR UNA MEMBRESÍA</p>
                      <p className="text-zinc-400 text-xs text-center mt-1">El registro está exclusivamente reservado para personas que posean Documento Nacional de Identidad (DNI) peruano. No se permite el registro con pasaporte, carnet de extranjería u otro documento de identidad.</p>
                    </div>
                    <p><strong className="text-white">4.1.</strong> Para afiliarse a FULLFORMA, EL SOCIO debe cumplir con los siguientes requisitos obligatorios:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Ser <strong className="text-white">mayor de dieciocho (18) años de edad</strong> al momento del registro.</li>
                      <li>Poseer un <strong className="text-white">Documento Nacional de Identidad (DNI)</strong> peruano válido y vigente, con un número de ocho (8) dígitos.</li>
                      <li>Completar el formulario de registro con los <strong className="text-white">datos de registro</strong> solicitados: nombres, apellidos, DNI, correo electrónico, fecha de nacimiento, sexo/género.</li>
                      <li>Crear una contraseña segura con un mínimo de ocho (8) caracteres.</li>
                      <li>Aceptar de manera <strong className="text-white">expresa e inequívoca</strong> los presentes Términos y Condiciones.</li>
                    </ol>
                    <p><strong className="text-white">4.2.</strong> La validación del DNI se realizará a través de RENIEC. Los datos de nombre y apellido quedarán bloqueados para su edición.</p>
                    <p><strong className="text-white">4.3.</strong> El registro no se considerará completo hasta que EL SOCIO haya confirmado su correo electrónico.</p>
                    <p><strong className="text-white">4.4.</strong> EL SOCIO declara que toda la información proporcionada es verdadera, completa y precisa. La falsedad podrá dar lugar a la cancelación inmediata de la membresía.</p>
                    <p><strong className="text-white">4.5.</strong> <strong className="text-white">Queda estrictamente prohibido</strong> el registro y adquisición de membresías sin DNI peruano. Las personas que no cuenten con este documento no podrán acceder a los servicios de FULLFORMA bajo ninguna modalidad.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 5 */}
              <AccordionItem value="5" id="clausula-5" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <CreditCard className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 5: PLANES Y PRECIOS
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">5.1.</strong> FULLFORMA ofrece los siguientes planes de membresía, cuyos precios incluyen el IGV del dieciocho por ciento (18%):</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                      {[
                        { name: 'Mensual', price: 'S/ 90.00', duration: '30 días' },
                        { name: 'Trimestral', price: 'S/ 250.00', duration: '90 días' },
                        { name: 'Anual', price: 'S/ 550.00', duration: '365 días' },
                      ].map((plan) => (
                        <div key={plan.name} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center hover:border-gym-logo/30 transition-colors">
                          <p className="font-arcade text-[10px] text-gym-logo tracking-wider uppercase mb-2">{plan.name}</p>
                          <p className="text-white font-bold text-xl">{plan.price}</p>
                          <p className="text-zinc-500 text-xs mt-1">{plan.duration}</p>
                        </div>
                      ))}
                    </div>
                    <p><strong className="text-white">5.2.</strong> Los planes incluyen los beneficios descritos en el Sistema al momento de la adquisición.</p>
                    <p><strong className="text-white">5.3.</strong> FULLFORMA se reserva el derecho de <strong className="text-white">modificar, actualizar, agregar o eliminar planes, precios y beneficios en cualquier momento y sin previo aviso</strong>.</p>
                    <p><strong className="text-white">5.4.</strong> Las modificaciones no afectarán a las membresías ya adquiridas y en vigencia.</p>
                    <p><strong className="text-white">5.5.</strong> Todos los precios se expresan en <strong className="text-white">Sol peruano (S/)</strong>.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 6 */}
              <AccordionItem value="6" id="clausula-6" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <CreditCard className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 6: FORMAS DE PAGO
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">6.1.</strong> EL SOCIO podrá realizar el pago de su membresía exclusivamente a través de las siguientes formas de pago:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                      <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <span className="text-gym-logo">$</span> Efectivo
                        </h4>
                        <p className="text-zinc-400 text-xs">Pago presencial en caja de la sede de FULLFORMA. El Recepcionista registrará el pago y emitirá la Boleta de Venta Electrónica.</p>
                      </div>
                      <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <span className="text-gym-logo">◎</span> MercadoPago
                        </h4>
                        <p className="text-zinc-400 text-xs">Pago electrónico a través de la pasarela de pago de MercadoPago. Se aceptan tarjetas de débito, crédito y otras modalidades habilitadas.</p>
                      </div>
                    </div>
                    <p><strong className="text-white">6.2.</strong> Queda expresamente prohibido el pago mediante cualquier otro medio no autorizado.</p>
                    <p><strong className="text-white">6.3.</strong> La confirmación del pago electrónico se realizará de manera automática mediante la verificación del webhook de MercadoPago.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 7 */}
              <AccordionItem value="7" id="clausula-7" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 7: COMPROBANTES DE PAGO
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">7.1.</strong> Por cada pago realizado, FULLFORMA emitirá exclusivamente una <strong className="text-white">Boleta de Venta Electrónica</strong>, conforme a la normativa tributaria de SUNAT.</p>
                    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 my-4">
                      <p className="text-red-400 font-bold text-center text-sm">NO SE EMITIRÁN FACTURAS</p>
                      <p className="text-red-400/70 text-center text-xs mt-1">Solo Boletas de Venta Electrónica a nombre del beneficiario.</p>
                    </div>
                    <p><strong className="text-white">7.2.</strong> La Boleta contendrá: razón social y RUC, número secuencial, fecha, datos del Socio, servicio adquirido, desglose del IGV, total en letras, forma de pago y periodo de vigencia.</p>
                    <p><strong className="text-white">7.3.</strong> EL SOCIO podrá descargar su Boleta en cualquier momento a través del Sistema.</p>
                    <p><strong className="text-white">7.4.</strong> La emisión de la Boleta se realizará de manera automática al confirmarse el pago.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 8 */}
              <AccordionItem value="8" id="clausula-8" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Ban className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 8: PAGO POR TERCEROS
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 mb-4">
                      <p className="text-red-400 font-bold text-center text-sm">PROHIBIDO PAGAR LA MEMBRESÍA DE OTRA PERSONA</p>
                    </div>
                    <p><strong className="text-white">8.1.</strong> El pago debe ser realizado exclusivamente por el propio EL SOCIO beneficiario.</p>
                    <p><strong className="text-white">8.2.</strong> En caso excepcional de que un tercero realice el pago, la <strong className="text-white">Boleta se emitirá a nombre del beneficiario de la membresía</strong>, y no a nombre de quien efectúe el pago.</p>
                    <p><strong className="text-white">8.3.</strong> FULLFORMA no se hace responsable por disputas entre el pagador y el beneficiario.</p>
                    <p><strong className="text-white">8.4.</strong> El pago por terceros no genera ningún derecho adicional para el pagador.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 9 */}
              <AccordionItem value="9" id="clausula-9" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Clock className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 9: VIGENCIA Y RENOVACIÓN
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">9.1.</strong> La membresía tendrá una vigencia determinada según el plan adquirido.</p>
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 my-4">
                      <p className="text-white font-semibold text-sm mb-1">Renovación NO automática</p>
                      <p className="text-zinc-400 text-xs">EL SOCIO deberá realizar el pago dentro del <strong className="text-white">Periodo de Renovación</strong> (siete (7) días calendario anteriores a la fecha de vencimiento).</p>
                    </div>
                    <p><strong className="text-white">9.2.</strong> Si EL SOCIO no renueva, su membresía vencerá y <strong className="text-white">perderá el acceso a las instalaciones</strong>.</p>
                    <p><strong className="text-white">9.3.</strong> En caso de renovación, la nueva membresía se iniciará a partir de la fecha de fin de la membresía anterior.</p>
                    <p><strong className="text-white">9.4.</strong> Si EL SOCIO tiene una membresía activa con más de 7 días restantes, <strong className="text-white">no podrá adquirir una nueva membresía</strong>.</p>
                    <p><strong className="text-white">9.5.</strong> FULLFORMA enviará notificaciones de recordatorio. El incumplimiento en el envío no generará responsabilidad.</p>
                    <p><strong className="text-white">9.6.</strong> El plazo de renovación es de naturaleza <strong className="text-white">perentoria e improrrogable</strong>.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 10 */}
              <AccordionItem value="10" id="clausula-10" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <UserX className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 10: UNA SOLA MEMBRESÍA POR SOCIO
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">10.1.</strong> Cada Socio solo podrá mantener <strong className="text-white">una (1) membresía activa a la vez</strong>.</p>
                    <p><strong className="text-white">10.2.</strong> Queda expresamente prohibida la tenencia simultánea de múltiples membresías.</p>
                    <p><strong className="text-white">10.3.</strong> Si el Sistema detecta una membresía activa, no se permitirá adquirir una nueva.</p>
                    <p><strong className="text-white">10.4.</strong> La violación de esta cláusula podrá dar lugar a la cancelación inmediata de todas las membresías, sin derecho a reembolso.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 11 */}
              <AccordionItem value="11" id="clausula-11" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <RefreshCw className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 11: CAMBIO DE PLAN
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">11.1.</strong> EL SOCIO podrá solicitar el cambio de plan <strong className="text-white">únicamente dentro del Periodo de Renovación</strong> (7 días antes del vencimiento).</p>
                    <p><strong className="text-white">11.2.</strong> El cambio implica la adquisición de un nuevo plan que se activará al finalizar el periodo actual.</p>
                    <p><strong className="text-white">11.3.</strong> No se realizarán reembolsos por cambios a un plan de menor valor.</p>
                    <p><strong className="text-white">11.4.</strong> Si EL SOCIO cambia a un plan de menor valor, deberá abonar la diferencia correspondiente.</p>
                    <p><strong className="text-white">11.5.</strong> No se permitirá el cambio de plan fuera del Periodo de Renovación.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 12 */}
              <AccordionItem value="12" id="clausula-12" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Users className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 12: TRANSFERENCIA DE MEMBRESÍA
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">12.1.</strong> La transferencia <strong className="text-white">solo podrá realizarse de manera presencial</strong> en la sede de FULLFORMA.</p>
                    <p><strong className="text-white">12.2.</strong> El Socio titular deberá acudir acompañado del nuevo beneficiario y solicitar el cambio ante un <strong className="text-white">Recepcionista</strong>.</p>
                    <p><strong className="text-white">12.3.</strong> La transferencia implica el <strong className="text-white">cambio del número de DNI</strong> asociado a la membresía.</p>
                    <p><strong className="text-white">12.4.</strong> Requisitos: ambas partes presentes, DNI vigente, y el nuevo beneficiario debe cumplir los requisitos de afiliación.</p>
                    <p><strong className="text-white">12.5.</strong> La transferencia no generará costo adicional, salvo que FULLFORMA disponga lo contrario.</p>
                    <p><strong className="text-white">12.6.</strong> Una vez efectuada, el Socio titular <strong className="text-white">perderá todos los derechos</strong> asociados a la membresía.</p>
                    <p><strong className="text-white">12.7.</strong> La transferencia no podrá realizarse si la membresía está suspendida o cancelada.</p>
                    <p><strong className="text-white">12.8.</strong> FULLFORMA no se hace responsable por las relaciones interpersonales entre las partes.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 13 */}
              <AccordionItem value="13" id="clausula-13" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Pencil className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 13: ACTUALIZACIÓN DE DATOS
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">13.1.</strong> EL SOCIO podrá solicitar la actualización de: <strong className="text-white">correo electrónico, número de teléfono y género/sexo</strong>.</p>
                    <p><strong className="text-white">13.2.</strong> Los datos de <strong className="text-white">nombre, apellido y DNI</strong> no podrán ser modificados, ya que fueron validados a través de RENIEC.</p>
                    <p><strong className="text-white">13.3.</strong> La actualización podrá ser solicitada en cualquier momento durante la vigencia de la membresía.</p>
                    <p><strong className="text-white">13.4.</strong> FULLFORMA se reserva el derecho de verificar la identidad antes de procesar cualquier cambio.</p>
                    <p><strong className="text-white">13.5.</strong> EL SOCIO es responsable de mantener sus datos actualizados.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 14 */}
              <AccordionItem value="14" id="clausula-14" className="bg-zinc-900 border border-red-900/30 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-red-950/50 flex items-center justify-center shrink-0">
                      <Ban className="size-4 text-red-400" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-red-400 tracking-wide">
                      CLÁUSULA 14: DEVOLUCIONES Y REEMBOLSOS
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 my-4">
                      <p className="text-red-400 font-bold text-center">NO SE ACEPTAN DEVOLUCIONES NI REEMBOLSOS</p>
                    </div>
                    <p><strong className="text-white">14.1.</strong> <strong className="text-white">NO SE ACEPTAN DEVOLUCIONES NI REEMBOLSOS</strong> bajo ninguna circunstancia.</p>
                    <p><strong className="text-white">14.2.</strong> Esta política aplica para pagos en efectivo, MercadoPago, renovaciones y cambios de plan.</p>
                    <p><strong className="text-white">14.3.</strong> La única excepción será en caso de <strong className="text-white">cobros por error manifiesto de FULLFORMA</strong>.</p>
                    <p><strong className="text-white">14.4.</strong> EL SOCIO declara haber leído y aceptado la presente política de no devolución.</p>
                    <p><strong className="text-white">14.5.</strong> La ausencia de uso de las instalaciones no generará derecho a reembolso, compensación ni extensión.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 15 */}
              <AccordionItem value="15" id="clausula-15" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 15: CANCELACIÓN DE LA MEMBRESÍA
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">15.1.</strong> La cancelación solo podrá ser solicitada a través de un <strong className="text-white">Recepcionista</strong> en la sede de FULLFORMA.</p>
                    <p><strong className="text-white">15.2.</strong> La cancelación generará: <strong className="text-white">pérdida inmediata del acceso</strong>, cierre de sesión en el Sistema, e imposibilidad de ingreso sin membresía vigente.</p>
                    <p><strong className="text-white">15.3.</strong> Una vez cancelada, <strong className="text-white">EL SOCIO no tendrá derecho a reclamo</strong> alguno por días restantes no utilizados.</p>
                    <p><strong className="text-white">15.4.</strong> La cancelación no exonera de obligaciones pendientes.</p>
                    <p><strong className="text-white">15.5.</strong> FULLFORMA podrá cancelar la membresía de manera unilateral por los motivos de la Cláusula 16.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 16 - ACTUALIZADA */}
              <AccordionItem value="16" id="clausula-16" className="bg-zinc-900 border border-red-900/30 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-red-950/50 flex items-center justify-center shrink-0">
                      <Shield className="size-4 text-red-400" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-red-400 tracking-wide">
                      CLÁUSULA 16: MOTIVOS DE CANCELACIÓN
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">16.1.</strong> FULLFORMA podrá cancelar la membresía de manera inmediata, sin previo aviso y sin derecho a reembolso, por cualquiera de los siguientes motivos:</p>

                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 my-4">
                      <ul className="space-y-1.5 text-zinc-400 text-xs">
                        {[
                          'Violencia física o verbal contra el personal, otros Socios o terceros.',
                          'Acoso, hostigamiento o intimidación de cualquier naturaleza.',
                          'Actos de discriminación por cualquier condición.',
                          'Consumo de alcohol, tabaco, vapeo, drogas o sustancias psicoactivas.',
                          'Porte de armas de cualquier tipo.',
                          'Daño intencional a instalaciones, equipos o pertenencias.',
                          'Hurto o robo de pertenencias.',
                          'Conducta sexual inapropiada o acoso sexual.',
                          'Grabación de imágenes o videos sin consentimiento.',
                          'Uso indebido de instalaciones que ponga en riesgo la integridad.',
                          'Incumplimiento de normas de convivencia.',
                          'Ingreso no autorizado a áreas restringidas.',
                          'Comercialización de productos no autorizados.',
                          'Prestación de servicios personales no autorizados.',
                          'Impago una vez vencido el Periodo de Renovación.',
                          'Uso de identidad falsa o documentación fraudulenta.',
                          'Incumplimiento de normas de higiene personal.',
                          'Uso inadecuado de equipos por negligencia.',
                          'Incumplimiento de horarios de atención.',
                          'Manipulación inadecuada de instalaciones sin autorización.',
                          'Cualquier conducta que atente contra la seguridad o bienestar de Socios, personal o instalaciones.',
                        ].map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-red-400 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 my-4 space-y-2">
                      <p className="text-red-400 font-bold text-sm text-center">CANCELACIÓN INMEDIATA SIN ADVERTENCIA PREVIA</p>
                      <p className="text-zinc-400 text-xs text-center">La cancelación procederá de manera inmediata ante cualquier incumplimiento, sin necesidad de amonestación, advertencia ni proceso alguno.</p>
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 my-4">
                      <p className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                        <Phone className="size-4 text-gym-logo" />
                        Comunicación de la cancelación
                      </p>
                      <p className="text-zinc-400 text-xs">La cancelación se comunicará <strong className="text-white">únicamente de manera presencial</strong> en la sede de FULLFORMA, por medio del personal autorizado. No se realizará comunicación por correo electrónico, teléfono, mensaje de texto, redes sociales ni por ningún otro medio digital o remoto.</p>
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                      <p className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                        <Ban className="size-4 text-red-400" />
                        Decisión definitiva e inapelable
                      </p>
                      <p className="text-zinc-400 text-xs">La decisión de cancelación es <strong className="text-white">definitiva e inapelable</strong>. EL SOCIO no tendrá derecho a reclamo, compensación, reembolso ni indemnización de ningún tipo.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 17 */}
              <AccordionItem value="17" id="clausula-17" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 17: CONSERVACIÓN DE DATOS
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">17.1.</strong> En caso de cancelación, <strong className="text-white">los datos personales de EL SOCIO NO serán eliminados</strong> del Sistema.</p>
                    <p><strong className="text-white">17.2.</strong> FULLFORMA conservará los datos por un plazo de <strong className="text-white">cinco (5) años</strong> desde la última interacción, o el plazo que establezca la legislación vigente.</p>
                    <p><strong className="text-white">17.3.</strong> La conservación se realizará conforme a la <strong className="text-white">Ley N° 29733</strong>, con finalidad de: cumplimiento tributario, prevención de fraudes, atención de reclamos y análisis estadísticos.</p>
                    <p><strong className="text-white">17.4.</strong> EL SOCIO podrá ejercer sus derechos de acceso, rectificación, eliminación u oposición conforme a la Ley N° 29733.</p>
                    <p><strong className="text-white">17.5.</strong> La eliminación definitiva se realizará una vez transcurrido el plazo y verificada la inexistencia de obligaciones pendientes.</p>
                    <p><strong className="text-white">17.6.</strong> FULLFORMA implementa medidas de seguridad técnicas y organizacionales para proteger los datos personales.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 18 */}
              <AccordionItem value="18" id="clausula-18" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Clock className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 18: SUSPENSIÓN TEMPORAL (FREEZE)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">18.1.</strong> EL SOCIO podrá solicitar la <strong className="text-white">suspensión temporal (Freeze)</strong> de su membresía, ya sea presencial ante un Recepcionista o a través de su portal de socio.</p>
                    <p><strong className="text-white">18.2.</strong> Cada membresía podrá ser suspendida un <strong className="text-white">máximo de dos (2) veces</strong> durante su vigencia. Las suspensiones no utilizadas se reinician al renovar.</p>
                    <p><strong className="text-white">18.3.</strong> La duración máxima por freeze depende del plan: Mensual 5 días, Trimestral 30 días, Anual 60 días. Al alcanzar el límite, la membresía se <strong className="text-white">reactiva automáticamente</strong>.</p>
                    <p><strong className="text-white">18.4.</strong> Durante la suspensión: sin acceso a instalaciones, el tiempo no se contabiliza, y la fecha de vencimiento se extiende.</p>
                    <p><strong className="text-white">18.5.</strong> EL SOCIO podrá reactivar su membresía de forma anticipada en cualquier momento.</p>
                    <p><strong className="text-white">18.6.</strong> Si se supera el límite de dos suspensiones, no se podrá solicitar una nueva hasta la renovación.</p>
                    <p><strong className="text-white">18.7.</strong> FULLFORMA podrá rechazar solicitudes sin justificación válida y modificar los plazos máximos de freeze.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 19 */}
              <AccordionItem value="19" id="clausula-19" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Heart className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 19: USO DE INSTALACIONES
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">19.1.</strong> EL SOCIO se obliga a hacer uso adecuado y responsable de todas las instalaciones, equipos y áreas.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                      {[
                        { title: 'Vestimenta e Higiene', items: ['Uso obligatorio de ropa deportiva y calzado deportivo.', 'Uso de toalla personal es obligatorio.', 'Respetar la higiene personal adecuada.'] },
                        { title: 'Uso de Equipos', items: ['Usar equipos según indicaciones del personal.', 'Está prohibido dejar caer pesas intencionalmente.', 'Depositar equipos en su lugar después de cada uso.'] },
                        { title: 'Convivencia', items: ['Mantener ambiente de respeto.', 'No usar celular con volumen alto.', 'No reservar equipos sin autorización.'] },
                        { title: 'Seguridad', items: ['No ingresar envases de vidrio.', 'No consumir alimentos en áreas de entrenamiento.', 'Resguardar objetos personales.'] },
                      ].map((section, i) => (
                        <div key={i} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                          <h4 className="text-white font-semibold mb-2 text-xs">{section.title}</h4>
                          <ul className="space-y-1 text-zinc-400 text-xs">
                            {section.items.map((item, j) => (
                              <li key={j} className="flex gap-2">
                                <span className="text-gym-logo shrink-0">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <p><strong className="text-white">19.2.</strong> El personal está autorizado a solicitar el egreso a Socios que incumplan las normas.</p>
                    <p><strong className="text-white">19.3.</strong> La reincidencia podrá dar lugar a las sanciones de la Cláusula 16.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 20 */}
              <AccordionItem value="20" id="clausula-20" className="bg-zinc-900 border border-red-900/30 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-red-950/50 flex items-center justify-center shrink-0">
                      <Ban className="size-4 text-red-400" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-red-400 tracking-wide">
                      CLÁUSULA 20: MENORES DE EDAD
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 my-4 space-y-1">
                      <p className="text-red-400 font-bold text-center text-sm">PROHIBIDO EL INGRESO DE MENORES DE EDAD</p>
                      <p className="text-red-400 font-bold text-center text-sm">PROHIBIDA LA COMPRA DE MEMBRESÍA A MENORES</p>
                    </div>
                    <p><strong className="text-white">20.1.</strong> Queda <strong className="text-white">expressamente prohibido el ingreso de menores de edad</strong> (menores de 18 años) a las instalaciones.</p>
                    <p><strong className="text-white">20.2.</strong> Queda <strong className="text-white">expressamente prohibida la compra o adquisición de una membresía</strong> a nombre o favor de una persona menor de edad.</p>
                    <p><strong className="text-white">20.3.</strong> El Sistema <strong className="text-white">rechazará automáticamente</strong> cualquier registro que no cumpla con el requisito de mayoría de edad.</p>
                    <p><strong className="text-white">20.4.</strong> Si se detecta el ingreso fraudulento de un menor: cancelación inmediata, expulsión y comunicación a padres/tutores.</p>
                    <p><strong className="text-white">20.5.</strong> FULLFORMA no asume responsabilidad por ingreso no autorizado de menores.</p>
                    <p><strong className="text-white">20.6.</strong> Los padres/tutores que faciliten el ingreso o registro de un menor asumirán la totalidad de la responsabilidad.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 21 */}
              <AccordionItem value="21" id="clausula-21" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Heart className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 21: RESPONSABILIDAD Y SALUD
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">21.1.</strong> EL SOCIO declara encontrarse en <strong className="text-white">óptimas condiciones físicas, mentales y de salud</strong> para la práctica de actividad física.</p>
                    <p><strong className="text-white">21.2.</strong> EL SOCIO declara conocer sus limitaciones físicas y acepta entrenar bajo su <strong className="text-white">propia responsabilidad</strong>.</p>
                    <p><strong className="text-white">21.3.</strong> FULLFORMA <strong className="text-white">no se hace responsable</strong> por: lesiones, enfermedades preexistentes, pérdida de objetos personales, daños causados por el Socio a equipos o terceros.</p>
                    <p><strong className="text-white">21.4.</strong> EL SOCIO es responsable del uso adecuado de los equipos y deberá seguir las indicaciones del personal.</p>
                    <p><strong className="text-white">21.5.</strong> En caso de condición médica especial, EL SOCIO se obliga a informar al personal antes de iniciar actividad física.</p>
                    <p><strong className="text-white">21.6.</strong> FULLFORMA recomienda consultar con un profesional de la salud antes de iniciar cualquier programa de ejercicio.</p>
                    <p><strong className="text-white">21.7.</strong> La práctica de actividad física es voluntaria y bajo el propio riesgo de EL SOCIO.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 22 */}
              <AccordionItem value="22" id="clausula-22" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 22: PROTECCIÓN DE DATOS
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">22.1.</strong> FULLFORMA se compromete a dar cumplimiento a la <strong className="text-white">Ley N° 29733, Ley de Protección de Datos Personales</strong>.</p>
                    <p><strong className="text-white">22.2.</strong> Los datos serán utilizados para: gestión de la membresía, validación ante RENIEC, emisión de Boletas, notificaciones, cumplimiento tributario, mejora del servicio y prevención de fraudes.</p>
                    <p><strong className="text-white">22.3.</strong> FULLFORMA <strong className="text-white">no compartirá, venderá ni transferirá</strong> datos personales a terceros, salvo por mandato judicial, entidades del Estado o proveedores bajo contratos de confidencialidad.</p>
                    <p><strong className="text-white">22.4.</strong> EL SOCIO podrá ejercer sus derechos de acceso, rectificación, eliminación y oposición conforme a la Ley N° 29733.</p>
                    <p><strong className="text-white">22.5.</strong> FULLFORMA implementa medidas de seguridad técnicas y organizacionales para proteger los datos.</p>
                    <p><strong className="text-white">22.6.</strong> Para consultas o reclamos, comunicarse con la Autoridad Nacional de Protección de Datos Personales (ANPDP).</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 23 */}
              <AccordionItem value="23" id="clausula-23" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 23: MODIFICACIONES
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">23.1.</strong> FULLFORMA se reserva el derecho de modificar los presentes Términos y Condiciones <strong className="text-white">en cualquier momento y sin previo aviso</strong>.</p>
                    <p><strong className="text-white">23.2.</strong> Las modificaciones serán publicadas en el Sistema y entrarán en vigencia desde su publicación.</p>
                    <p><strong className="text-white">23.3.</strong> EL SOCIO será notificado de las modificaciones relevantes.</p>
                    <p><strong className="text-white">23.4.</strong> El uso continuado después de las modificaciones constituirá <strong className="text-white">aceptación tácita</strong>.</p>
                    <p><strong className="text-white">23.5.</strong> Si EL SOCIO no está de acuerdo, podrá cancelar su membresía sin derecho a reembolso.</p>
                    <p><strong className="text-white">23.6.</strong> Las modificaciones no afectarán membresías ya adquiridas, salvo disposiciones legales imperativas.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 24 */}
              <AccordionItem value="24" id="clausula-24" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <Scale className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 24: LEGISLACIÓN Y JURISDICCIÓN
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">24.1.</strong> El presente Acuerdo se rige conforme a las leyes de la República del Perú: Código Civil, Ley N° 29571 (Código del Consumidor), Ley N° 29733 (Protección de Datos Personales), y normas tributarias.</p>
                    <p><strong className="text-white">24.2.</strong> Las Partes se someten a la <strong className="text-white">jurisdicción de los tribunales competentes de Trujillo, La Libertad</strong>.</p>
                    <p><strong className="text-white">24.3.</strong> Las Partes buscarán solución amistosa antes de recurrir a la vía judicial (plazo de 30 días calendario).</p>
                    <p><strong className="text-white">24.4.</strong> EL SOCIO podrá presentar reclamos ante la Dirección General de Protección al Consumidor o la ANPDP.</p>
                    <p><strong className="text-white">24.5.</strong> Si alguna disposición fuera declarada nula, las demás mantendrán su vigencia.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CLÁUSULA 25 */}
              <AccordionItem value="25" id="clausula-25" className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-gym-logo/10 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-gym-logo" />
                    </div>
                    <span className="font-arcade text-[10px] md:text-xs text-white tracking-wide">
                      CLÁUSULA 25: DISPOSICIONES FINALES
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-zinc-300 space-y-3 text-sm leading-relaxed pl-11">
                    <p><strong className="text-white">25.1.</strong> El presente Acuerdo constituye el acuerdo integral entre las Partes.</p>
                    <p><strong className="text-white">25.2.</strong> La omisión o demora en ejercer derechos no constituye renuncia.</p>
                    <p><strong className="text-white">25.3.</strong> Los títulos de las cláusulas son solo para referencia.</p>
                    <p><strong className="text-white">25.4.</strong> EL SOCIO declara haber leído íntegramente, comprendido y aceptado todas las disposiciones.</p>
                    <p><strong className="text-white">25.5.</strong> La aceptación se materializa de manera <strong className="text-white">expresa</strong> (casilla durante el registro) y <strong className="text-white">tácita</strong> (uso del servicio tras modificaciones).</p>
                    <p><strong className="text-white">25.6.</strong> El Acuerdo entrará en vigencia desde la aceptación y mantendrá su vigencia durante toda la membresía.</p>
                    <p><strong className="text-white">25.7.</strong> Para consultas, solicitudes o reclamos:</p>
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 text-center mt-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MapPin className="size-4 text-gym-logo" />
                        <p className="text-white font-semibold text-sm">Sede: Jr. Bolognesi N° 231, 2do piso, Trujillo, La Libertad</p>
                      </div>
                      <p className="text-zinc-400 text-xs">Web: fullforma.vercel.app</p>
                      <p className="text-zinc-400 text-xs">Facebook: GimnasioFullForma | Instagram: fullformaoficial</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            {/* Footer de aceptación */}
            <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-gym-logo/30" />
                <ShieldCheck className="size-6 text-gym-logo" />
                <div className="h-px w-12 bg-gym-logo/30" />
              </div>
              <p className="text-white font-bold text-sm md:text-base mb-2">
                He leído, comprendo y acepto los presentes Términos y Condiciones de Membresía.
              </p>
              <p className="text-zinc-500 text-xs font-mono">aceptaTerminos: true</p>

              <div className="mt-6 pt-4 border-t border-zinc-800">
                <p className="font-arcade text-[10px] text-gym-logo tracking-wider">FULLFORMA</p>
                <p className="text-zinc-500 text-[10px] font-mono mt-1">ENTERPRISE FITNESS ELITE S.A.C. — RUC: 20482468692</p>
                <p className="text-zinc-600 text-[10px] font-mono">Jr. Bolognesi N° 231, 2do piso — Trujillo, La Libertad — Perú</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
