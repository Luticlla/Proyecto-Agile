export type EstadoMembresia = 'todos' | 'activas' | 'vencidas' | 'canceladas' | 'suspendidas' | 'por_vencer'

export type MetodoPago = 'efectivo' | 'mercadopago'

export type MembresiaFilters = {
  buscar?: string
  estado?: EstadoMembresia
  page?: number
  limit?: number
}

export type MembresiaListResult = {
  data: MembresiaConCliente[]
  count: number
  page: number
  totalPages: number
}

export type MembresiaConCliente = {
  id: number
  usuario_id: string
  cliente_nombre: string
  cliente_apellido: string
  cliente_dni: string
  plan_id: number
  plan_nombre: string
  plan_precio: number
  plan_duracion_dias: number
  estado: string
  fecha_inicio: string
  fecha_fin: string
  dias_restantes: number
  creado_en: string
  freeze_inicio: string | null
  freeze_fin: string | null
  veces_pausada: number
  dias_freeze_maximo: number
}

export type RegistrarMembresiaDTO = {
  usuario_id: string
  plan_id: number
  metodo_pago: MetodoPago
  monto: number
}

export type CambiarEstadoDTO = {
  accion: 'cancelar' | 'pausar' | 'reactivar'
}

export type RenovarMembresiaDTO = {
  plan_id: number
  metodo_pago: MetodoPago
  monto: number
}

export type BoletaItem = {
  descripcion: string
  cantidad: number
  valor_unitario: number  // base sin IGV
  precio_unitario: number // con IGV
  valor_total: number     // valor_unitario * cantidad
}

export type BoletaData = {
  numero_comprobante: string    // B026-0001
  fecha_emision: string         // DD-MM-YYYY
  cliente: {
    nombre: string
    dni: string
    codigo?: string
  }
  moneda: string                // SOL
  metodo_pago: string           // efectivo, mercadopago, yape, plin, etc.
  items: BoletaItem[]
  subtotal: number              // base gravada
  igv: number                   // 18%
  total: number                 // subtotal + igv
  total_letras: string
  observaciones?: string
  fecha_inicio: string
  fecha_fin: string
}
