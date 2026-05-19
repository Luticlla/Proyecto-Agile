import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          rol_id: number
          nombre: string
          apellido: string
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
          telefono?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          activo?: boolean
        }
        Update: {
          nombre?: string
          apellido?: string
          telefono?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          activo?: boolean
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
          creado_en: string
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
        }
      }
      pagos: {
        Row: {
          id: number
          suscripcion_id: number
          usuario_id: string
          monto: number
          metodo_pago: string
          estado: string
          referencia: string | null
          observaciones: string | null
          registrado_por: string
          fecha_pago: string
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
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type PlanMembresia = Database['public']['Tables']['planes_membresia']['Row']
export type Suscripcion = Database['public']['Tables']['suscripciones']['Row']
export type Pago = Database['public']['Tables']['pagos']['Row']