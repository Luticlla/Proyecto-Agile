export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          rol_id: number
          nombre: string
          apellido: string
          dni: string | null
          email: string | null
          telefono: string | null
          fecha_nacimiento: string | null
          genero: string | null
          activo: boolean
          creado_en: string
          actualizado_en: string
        }
        Insert: {
          id: string
          rol_id: number
          nombre: string
          apellido: string
          dni?: string | null
          email?: string | null
          telefono?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          activo?: boolean
        }
        Update: {
          nombre?: string
          apellido?: string
          dni?: string | null
          email?: string | null
          telefono?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          activo?: boolean
        }
      }
      clases_grupales: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          entrenador: string | null
          capacidad: number | null
          color_hex: string
          activa: boolean
          creado_en: string
        }
        Insert: {
          id?: number
          nombre: string
          descripcion?: string | null
          entrenador?: string | null
          capacidad?: number | null
          color_hex?: string
          activa?: boolean
        }
        Update: {
          nombre?: string
          descripcion?: string | null
          entrenador?: string | null
          capacidad?: number | null
          color_hex?: string
          activa?: boolean
        }
      }
      horarios_clases: {
        Row: {
          id: number
          clase_id: number
          dia_semana: number
          hora_inicio: string
          hora_fin: string
        }
        Insert: {
          id?: number
          clase_id: number
          dia_semana: number
          hora_inicio: string
          hora_fin: string
        }
        Update: {
          clase_id?: number
          dia_semana?: number
          hora_inicio?: string
          hora_fin?: string
        }
      }
      roles: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
        }
        Insert: {
          id?: number
          nombre: string
          descripcion?: string | null
        }
        Update: {
          nombre?: string
          descripcion?: string | null
        }
      }
      planes_membresia: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          precio: number
          duracion_dias: number
          activo: boolean
          features: string[] | null
          dias_freeze_maximo: number
          creado_en: string
        }
        Insert: {
          id?: number
          nombre: string
          descripcion?: string | null
          precio: number
          duracion_dias: number
          activo?: boolean
          features?: string[] | null
          dias_freeze_maximo?: number
        }
        Update: {
          nombre?: string
          descripcion?: string | null
          precio?: number
          duracion_dias?: number
          activo?: boolean
          features?: string[] | null
          dias_freeze_maximo?: number
        }
      }
      suscripciones: {
        Row: {
          id: number
          usuario_id: string
          plan_id: number
          fecha_inicio: string
          fecha_fin: string
          estado: string
          creado_por: string
          creado_en: string
          veces_pausada: number
          freeze_inicio: string | null
          freeze_fin: string | null
        }
        Insert: {
          id?: number
          usuario_id: string
          plan_id: number
          fecha_inicio: string
          fecha_fin: string
          estado?: string
          creado_por: string
          veces_pausada?: number
          freeze_inicio?: string | null
          freeze_fin?: string | null
        }
        Update: {
          usuario_id?: string
          plan_id?: number
          fecha_inicio?: string
          fecha_fin?: string
          estado?: string
          creado_por?: string
          veces_pausada?: number
          freeze_inicio?: string | null
          freeze_fin?: string | null
        }
      }
      pagos: {
        Row: {
          id: number
          suscripcion_id: number | null
          usuario_id: string
          monto: number
          metodo_pago: string
          estado: string
          referencia: string | null
          observaciones: string | null
          registrado_por: string
          fecha_pago: string
        }
        Insert: {
          id?: number
          suscripcion_id?: number | null
          usuario_id: string
          monto: number
          metodo_pago: string
          estado?: string
          referencia?: string | null
          observaciones?: string | null
          registrado_por: string
        }
        Update: {
          suscripcion_id?: number | null
          usuario_id?: string
          monto?: number
          metodo_pago?: string
          estado?: string
          referencia?: string | null
          observaciones?: string | null
          registrado_por?: string
        }
      }
      accesos: {
        Row: {
          id: number
          usuario_id: string
          tipo: string
          metodo: string
          registrado_por: string | null
          fecha_hora: string
        }
        Insert: {
          id?: number
          usuario_id: string
          tipo?: string
          metodo?: string
          registrado_por?: string | null
        }
        Update: {
          usuario_id?: string
          tipo?: string
          metodo?: string
          registrado_por?: string | null
        }
      }
      notificaciones: {
        Row: {
          id: number
          usuario_id: string
          tipo: string
          titulo: string
          mensaje: string
          leida: boolean
          creado_en: string
        }
        Insert: {
          id?: number
          usuario_id: string
          tipo: string
          titulo: string
          mensaje: string
          leida?: boolean
        }
        Update: {
          usuario_id?: string
          tipo?: string
          titulo?: string
          mensaje?: string
          leida?: boolean
        }
      }
      auditoria: {
        Row: {
          id: number
          usuario_id: string
          tabla_afectada: string
          accion: string
          registro_id: number | null
          detalle: Record<string, unknown> | null
          ip_origen: string | null
          fecha: string
        }
        Insert: {
          id?: number
          usuario_id: string
          tabla_afectada: string
          accion: string
          registro_id?: number | null
          detalle?: Record<string, unknown> | null
          ip_origen?: string | null
        }
        Update: {
          usuario_id?: string
          tabla_afectada?: string
          accion?: string
          registro_id?: number | null
          detalle?: Record<string, unknown> | null
          ip_origen?: string | null
        }
      }
      sedes: {
        Row: {
          id: number
          nombre: string
          direccion: string
          latitud: number | null
          longitud: number | null
          telefono: string
          email: string
          imagen_url: string | null
          apertura_lv: string
          cierre_lv: string
          apertura_sab: string
          cierre_sab: string
          apertura_dom: string | null
          cierre_dom: string | null
          estado: string
          creado_en: string
          actualizado_en: string
        }
        Insert: {
          id?: number
          nombre: string
          direccion: string
          latitud?: number | null
          longitud?: number | null
          telefono: string
          email: string
          imagen_url?: string | null
          apertura_lv?: string
          cierre_lv?: string
          apertura_sab?: string
          cierre_sab?: string
          apertura_dom?: string | null
          cierre_dom?: string | null
          estado?: string
        }
        Update: {
          nombre?: string
          direccion?: string
          latitud?: number | null
          longitud?: number | null
          telefono?: string
          email?: string
          imagen_url?: string | null
          apertura_lv?: string
          cierre_lv?: string
          apertura_sab?: string
          cierre_sab?: string
          apertura_dom?: string | null
          cierre_dom?: string | null
          estado?: string
        }
      }
    }
    Functions: {
      get_email_by_dni: {
        Args: { p_dni: string }
        Returns: string
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Profile con email (ya incluido en Profile desde la migración)
export type ProfileWithEmail = Profile & { email: string }

export type Rol = Database['public']['Tables']['roles']['Row']
export type RolNombre = 'admin' | 'recepcionista' | 'miembro'

export type PlanMembresia = Database['public']['Tables']['planes_membresia']['Row']
export type PlanMembresiaInsert = Database['public']['Tables']['planes_membresia']['Insert']
export type PlanMembresiaUpdate = Database['public']['Tables']['planes_membresia']['Update']

export type Suscripcion = Database['public']['Tables']['suscripciones']['Row']
export type SuscripcionInsert = Database['public']['Tables']['suscripciones']['Insert']

export type Pago = Database['public']['Tables']['pagos']['Row']
export type PagoInsert = Database['public']['Tables']['pagos']['Insert']

export type Acceso = Database['public']['Tables']['accesos']['Row']
export type AccesoInsert = Database['public']['Tables']['accesos']['Insert']

export type Notificacion = Database['public']['Tables']['notificaciones']['Row']
export type NotificacionInsert = Database['public']['Tables']['notificaciones']['Insert']

export type Auditoria = Database['public']['Tables']['auditoria']['Row']
export type AuditoriaInsert = Database['public']['Tables']['auditoria']['Insert']

export type Sede = Database['public']['Tables']['sedes']['Row']
export type SedeInsert = Database['public']['Tables']['sedes']['Insert']
export type SedeUpdate = Database['public']['Tables']['sedes']['Update']

