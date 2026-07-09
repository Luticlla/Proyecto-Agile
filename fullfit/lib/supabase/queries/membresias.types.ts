export type EstadoMembresia = 'todos' | 'activas' | 'vencidas' | 'canceladas' | 'suspendidas' | 'por_vencer'

export type MetodoPago = 'efectivo' | 'mercadopago'

export type MembresiaFilters = {
  buscar?: string
  estado?: EstadoMembresia
  page?: number
  limit?: number
  sedeId?: number
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
}

export type RegistrarMembresiaDTO = {
  usuario_id: string
  plan_id: number
  metodo_pago: MetodoPago
  monto: number
  sedeId?: number
}

export type CambiarEstadoDTO = {
  accion: 'cancelar' | 'pausar' | 'reactivar'
}

export type RenovarMembresiaDTO = {
  plan_id: number
  metodo_pago: MetodoPago
  monto: number
}

export type BoletaData = {
  numero_boleta: string
  fecha: string
  cliente: {
    nombre: string
    dni: string
  }
  plan: {
    nombre: string
    precio: number
  }
  monto_total: number
  fecha_inicio: string
  fecha_fin: string
}
