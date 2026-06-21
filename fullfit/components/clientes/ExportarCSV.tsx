'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ClienteConMembresia } from '@/lib/supabase/queries/clientes.types'
import { getFechaLima } from '@/lib/utils'
import { formatDate } from '@/lib/utils/dates'

interface ExportarCSVProps {
  clientes: ClienteConMembresia[]
}

function escaparCSV(valor: string | number | null | undefined): string {
  if (valor === null || valor === undefined) return ''
  const str = String(valor)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function ExportarCSV({ clientes }: ExportarCSVProps) {
  const [generando, setGenerando] = useState(false)

  const handleExportar = async () => {
    if (clientes.length === 0) return
    setGenerando(true)

    try {
      const encabezados = [
        'Nombre',
        'Apellido',
        'DNI',
        'Email',
        'Teléfono',
        'Fecha Registro',
        'Plan',
        'Vencimiento',
        'Días Restantes',
        'Estado Membresía',
        'Estado Cliente',
      ]

      const filas = clientes.map((c) => [
        escaparCSV(c.nombre),
        escaparCSV(c.apellido),
        escaparCSV(c.dni),
        escaparCSV(c.email),
        escaparCSV(c.telefono),
        escaparCSV(c.creado_en ? formatDate(c.creado_en.split('T')[0]) : ''),
        escaparCSV(c.membresia_plan_nombre || 'Sin plan'),
        escaparCSV(c.membresia_fecha_fin ? formatDate(c.membresia_fecha_fin) : ''),
        escaparCSV(c.membresia_dias_restantes !== undefined ? c.membresia_dias_restantes : ''),
        escaparCSV(c.membresia_estado || 'Sin membresía'),
        escaparCSV(c.activo ? 'Activo' : 'Inactivo'),
      ])

      const contenidoCSV = [
        encabezados.join(','),
        ...filas.map((f) => f.join(',')),
      ].join('\n')

      const blob = new Blob(['\uFEFF' + contenidoCSV], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = `clientes_fullforma_${getFechaLima()}.csv`
      document.body.appendChild(enlace)
      enlace.click()
      document.body.removeChild(enlace)
      URL.revokeObjectURL(url)
    } finally {
      setGenerando(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportar}
      disabled={generando || clientes.length === 0}
      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2"
    >
      {generando ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      {generando ? 'Exportando...' : 'Exportar CSV'}
    </Button>
  )
}
