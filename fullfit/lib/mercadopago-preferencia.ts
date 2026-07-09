import { Preference } from 'mercadopago'
import { getMercadoPagoClient } from './mercadopago'

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || ''

type PreferenciaParams = {
  planId: number
  planNombre: string
  userId: string
  monto: number
  metadata: Record<string, string>
  siteUrl?: string
}

type PreferenciaResult = {
  init_point: string | null
  error?: string
}

/**
 * Crea una preferencia de pago en MercadoPago.
 * Retorna la URL de checkout (init_point) o un error.
 */
export async function crearPreferenciaPago(
  params: PreferenciaParams
): Promise<PreferenciaResult> {
  try {
    // Validar monto: MercadoPago requiere unit_price > 0
    const monto = Math.round(Number(params.monto) * 100) / 100
    if (!monto || isNaN(monto) || monto <= 0) {
      console.error('Monto inválido para MercadoPago:', params.monto)
      return { init_point: null, error: 'El monto del plan no es válido. Debe ser mayor a 0.' }
    }

    const baseSiteUrl = params.siteUrl || SITE_URL || ''
    const cleanSiteUrl = baseSiteUrl.endsWith('/') ? baseSiteUrl.slice(0, -1) : baseSiteUrl

    if (!SITE_URL) {
      console.error('SITE_URL no está configurado. Define la variable de entorno SITE_URL o NEXT_PUBLIC_SITE_URL.')
      return { init_point: null, error: 'URL del sitio no configurada. Contacta al administrador.' }
    }

    const client = getMercadoPagoClient()
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [{
          id: String(params.planId),
          title: `Membresía ${params.planNombre} - FULLFORMA`,
          quantity: 1,
          unit_price: monto,
          currency_id: 'PEN',
        }],
        metadata: params.metadata,
        back_urls: {
          success: `${cleanSiteUrl}/pasarelapago?status=approved`,
          failure: `${cleanSiteUrl}/pasarelapago?status=rejected`,
          pending: `${cleanSiteUrl}/pasarelapago?status=pending`,
        },
        auto_return: 'approved',
      },
    })

    return { init_point: result.init_point || null }
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error)
    return { init_point: null, error: 'Error al crear preferencia de pago' }
  }
}
