import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { BoletaData, BoletaItem } from '../supabase/queries/membresias.types'
import { montoEnLetras } from './numero-a-letras'
import { createServiceRoleClient } from '../supabase/server'

const DATOS_EMPRESA = {
  razon_social: 'ENTERPRISE FITNESS ELITE S.A.C.',
  nombre_comercial: 'FULLFORMA',
  direccion: 'Jr. Bolognesi N° 231, 2do piso - La Libertad - Trujillo - PERÚ',
  ruc: '20482468692',
  web: 'fullforma.vercel.app',
  sucursal: {
    direccion: 'Jr. Bolognesi N° 231, Trujillo - La Libertad'
  }
}

const IGV_RATE = 0.18

export function calcularIGV(precioConIGV: number): {
  valorUnitario: number
  igv: number
  total: number
} {
  const valorUnitario = Math.round((precioConIGV / (1 + IGV_RATE)) * 100) / 100
  const igv = Math.round((precioConIGV - valorUnitario) * 100) / 100
  const total = precioConIGV

  return { valorUnitario, igv, total }
}

/**
 * Obtiene el siguiente número de comprobante secuencial para el año actual.
 * Formato: B{YY}-{XXXX} donde YY es el año y XXXX es el secuencial.
 * Ejemplo: B26-0001, B26-0002, etc.
 * Usa service role internamente para bypass RLS.
 */
export async function obtenerSiguienteComprobante(): Promise<string> {
  const supabaseAdmin = createServiceRoleClient()
  const year = new Date().getFullYear()
  const prefix = `B${year.toString().slice(-2)}`

  const { data } = await supabaseAdmin
    .from('pagos')
    .select('referencia')
    .like('referencia', `${prefix}-%`)
    .order('referencia', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextNumber = 1
  if (data?.referencia) {
    const parts = data.referencia.split('-')
    if (parts.length === 2) {
      const lastNum = parseInt(parts[1], 10)
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1
      }
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(4, '0')}`
}

/**
 * Genera un número de comprobante local (sin BD).
 * Útil para cuando ya se tiene el número de la BD.
 */
export function generarNumeroComprobanteLocal(numero: number, year?: number): string {
  const anio = (year || new Date().getFullYear()).toString().slice(-2)
  return `B${anio}-${numero.toString().padStart(4, '0')}`
}

export function formatearFechaEmision(fecha: string): string {
  const [year, month, day] = fecha.split('-')
  return `${day}-${month}-${year}`
}

function crearBoletaData(params: {
  numeroComprobante: string
  planNombre: string
  planPrecio: number
  clienteNombre: string
  clienteDni: string
  clienteCodigo?: string
  fechaInicio: string
  fechaFin: string
  observaciones?: string
  metodo_pago?: string
}): BoletaData {
  const { valorUnitario, igv, total } = calcularIGV(params.planPrecio)

  const item: BoletaItem = {
    descripcion: params.planNombre,
    cantidad: 1,
    valor_unitario: valorUnitario,
    precio_unitario: params.planPrecio,
    valor_total: valorUnitario
  }

  return {
    numero_comprobante: params.numeroComprobante,
    fecha_emision: formatearFechaEmision(params.fechaInicio),
    cliente: {
      nombre: params.clienteNombre,
      dni: params.clienteDni,
      codigo: params.clienteCodigo
    },
    moneda: 'SOL',
    metodo_pago: params.metodo_pago || 'efectivo',
    items: [item],
    subtotal: valorUnitario,
    igv: igv,
    total: total,
    total_letras: montoEnLetras(total),
    observaciones: params.observaciones,
    fecha_inicio: params.fechaInicio,
    fecha_fin: params.fechaFin
  }
}

export function generarBoletaPDF(datos: BoletaData): Blob {
  const doc = new jsPDF()

  // Header - Razón Social
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(DATOS_EMPRESA.razon_social, 105, 15, { align: 'center' })

  // Nombre comercial
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(DATOS_EMPRESA.nombre_comercial, 105, 22, { align: 'center' })

  // Dirección
  doc.setFontSize(8)
  doc.text(DATOS_EMPRESA.direccion, 105, 28, { align: 'center' })

  // Web
  doc.text(`Web: ${DATOS_EMPRESA.web}`, 105, 33, { align: 'center' })

  // Sucursal
  doc.setFontSize(7)
  doc.text('Sucursal:', 20, 40)
  doc.text(DATOS_EMPRESA.sucursal.direccion, 20, 44)

  // Separador
  doc.setDrawColor(0)
  doc.line(20, 48, 190, 48)

  // Título boleta
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('BOLETA DE VENTA ELECTRÓNICA', 105, 56, { align: 'center' })

  // RUC
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`RUC: ${DATOS_EMPRESA.ruc}`, 105, 62, { align: 'center' })

  // Separador
  doc.line(20, 66, 190, 66)

  // Número y fecha
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Nro. Comprobante:', 20, 74)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.numero_comprobante, 55, 74)

  doc.setFont('helvetica', 'bold')
  doc.text('Fecha:', 140, 74)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.fecha_emision, 155, 74)

  // Separador
  doc.line(20, 78, 190, 78)

  // Datos del cliente
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Cliente:', 20, 86)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.cliente.nombre, 40, 86)

  doc.setFont('helvetica', 'bold')
  doc.text('DNI:', 20, 92)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.cliente.dni, 40, 92)

  doc.setFont('helvetica', 'bold')
  doc.text('Moneda:', 140, 86)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.moneda, 165, 86)

  if (datos.cliente.codigo) {
    doc.setFont('helvetica', 'bold')
    doc.text('Cod. Cliente:', 140, 92)
    doc.setFont('helvetica', 'normal')
    doc.text(datos.cliente.codigo, 172, 92)
  }

  // Separador
  doc.line(20, 96, 190, 96)

  // Título detalle
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Detalle del Comprobante', 20, 104)

  // Tabla de items
  const tableData = datos.items.map(item => [
    item.descripcion,
    item.cantidad.toFixed(2),
    `S/ ${item.valor_unitario.toFixed(2)}`,
    `S/ ${item.precio_unitario.toFixed(2)}`,
    `S/ ${item.valor_total.toFixed(2)}`
  ])

  autoTable(doc, {
    startY: 108,
    head: [['Descripción', 'Cant.', 'Valor Unit.', 'Precio Unit.', 'Valor Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30], fontSize: 8 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    }
  })

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  // Resumen
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Valor de Venta - Operaciones Gravadas:', 20, finalY)
  doc.setFont('helvetica', 'normal')
  doc.text(`S/ ${datos.subtotal.toFixed(2)}`, 170, finalY, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.text('IGV (18.00%):', 20, finalY + 6)
  doc.setFont('helvetica', 'normal')
  doc.text(`S/ ${datos.igv.toFixed(2)}`, 170, finalY + 6, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.text('Importe Total:', 20, finalY + 12)
  doc.text(`S/ ${datos.total.toFixed(2)}`, 170, finalY + 12, { align: 'right' })

  // Total en letras
  doc.setFont('helvetica', 'bold')
  doc.text('SON:', 20, finalY + 18)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.total_letras, 35, finalY + 18)

  // Forma de pago
  const formaPago = datos.metodo_pago === 'efectivo' ? 'Efectivo' : 'Virtual'
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Forma de pago:', 20, finalY + 25)
  doc.setFont('helvetica', 'normal')
  doc.text(formaPago, 55, finalY + 25)

  // Separador
  doc.line(20, finalY + 29, 190, finalY + 29)

  // Observaciones
  if (datos.observaciones) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('Observaciones:', 20, finalY + 35)
    doc.setFont('helvetica', 'normal')
    doc.text(datos.observaciones, 20, finalY + 40)
  }

  // Footer
  const footerY = finalY + (datos.observaciones ? 47 : 36)
  doc.line(20, footerY, 190, footerY)

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('¡Gracias por entrenar con nosotros!', 105, footerY + 6, { align: 'center' })
  doc.text(DATOS_EMPRESA.web, 105, footerY + 10, { align: 'center' })

  return doc.output('blob')
}

export function generarBoletaBase64(datos: BoletaData): Promise<string> {
  const blob = generarBoletaPDF(datos)
  const buffer = blob.arrayBuffer()
  return buffer.then(buf => Buffer.from(buf).toString('base64'))
}

export function downloadBoleta(blob: Blob, numeroComprobante: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `boleta_${numeroComprobante}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export { crearBoletaData }
