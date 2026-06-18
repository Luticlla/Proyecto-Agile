import { supabase } from '../client'

export async function buscarEmailPorDni(dni: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('get_email_by_dni' as never, { p_dni: dni } as never)

  if (error) {
    console.error('Error looking up email by DNI:', error)
    return null
  }

  return data as string | null
}
