import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { BoletaData } from '../supabase/queries/membresias.types'
import { formatDate } from './dates'

const DATOS_GIMNASIO = {
  nombre: 'FULLFORMA Gym',
  direccion: 'Av. Principal 123, Trujillo',
  ruc: '20XXXXXXX',
  telefono: '(044) 123456',
  web: 'www.ubaubawaza.vercel.app'
}

export function generarBoletaPDF(datos: BoletaData): Blob {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(DATOS_GIMNASIO.nombre, 105, 20, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(DATOS_GIMNASIO.direccion, 105, 28, { align: 'center' })
  doc.text(`RUC: ${DATOS_GIMNASIO.ruc}`, 105, 34, { align: 'center' })
  doc.text(`Tel: ${DATOS_GIMNASIO.telefono}`, 105, 40, { align: 'center' })

  doc.setDrawColor(0)
  doc.line(20, 45, 190, 45)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('BOLETA DE VENTA', 105, 55, { align: 'center' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`N°: ${datos.numero_boleta}`, 20, 65)
  doc.text(`Fecha: ${formatDate(datos.fecha)}`, 20, 72)

  doc.line(20, 78, 190, 78)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE:', 20, 88)
  doc.setFont('helvetica', 'normal')
  doc.text(`Nombre: ${datos.cliente.nombre}`, 20, 95)
  doc.text(`DNI: ${datos.cliente.dni}`, 20, 102)

  doc.line(20, 108, 190, 108)

  doc.setFont('helvetica', 'bold')
  doc.text('DETALLE:', 20, 118)

  const tableData = [
    [datos.plan.nombre, `S/ ${datos.plan.precio.toFixed(2)}`, '1', `S/ ${datos.monto_total.toFixed(2)}`]
  ]

  autoTable(doc, {
    startY: 125,
    head: [['Concepto', 'Precio', 'Cant.', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 30, 30] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' }
    }
  })

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', 130, finalY)
  doc.text(`S/ ${datos.monto_total.toFixed(2)}`, 170, finalY, { align: 'right' })

  doc.line(20, finalY + 5, 190, finalY + 5)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`MÉTODO DE PAGO: Efectivo`, 20, finalY + 15)
  doc.text(`Vigencia: ${formatDate(datos.fecha_inicio)} - ${formatDate(datos.fecha_fin)}`, 20, finalY + 22)

  doc.line(20, finalY + 28, 190, finalY + 28)

  doc.setFontSize(9)
  doc.text('¡Gracias por entrenar con nosotros!', 105, finalY + 38, { align: 'center' })
  doc.text(DATOS_GIMNASIO.web, 105, finalY + 44, { align: 'center' })

  return doc.output('blob')
}

/**
 * Genera una boleta PDF y la retorna como string Base64.
 * Útil para enviar desde API routes al cliente.
 */
export async function generarBoletaBase64(datos: BoletaData): Promise<string> {
  const blob = generarBoletaPDF(datos)
  const buffer = await blob.arrayBuffer()
  return Buffer.from(buffer).toString('base64')
}

/**
 * Descarga una boleta PDF en el navegador del usuario.
 * Crea un enlace temporal y lo simula como click de descarga.
 */
export function downloadBoleta(blob: Blob, numeroBoleta: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `boleta_${numeroBoleta}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
