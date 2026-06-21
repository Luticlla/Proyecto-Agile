import { Preference } from 'mercadopago'
import { getMercadoPagoClient } from './mercadopago'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

type PreferenciaParams = {
  planId: number
  planNombre: string
  userId: string
  monto: number
  metadata: Record<string, string>
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
    const client = getMercadoPagoClient()
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [{
          id: String(params.planId),
          title: `Membresía ${params.planNombre} - Full Forma`,
          quantity: 1,
          unit_price: params.monto,
          currency_id: 'PEN',
        }],
        metadata: params.metadata,
        back_urls: {
          success: `${SITE_URL}/pasarelapago?status=approved`,
          failure: `${SITE_URL}/pasarelapago?status=rejected`,
          pending: `${SITE_URL}/pasarelapago?status=pending`,
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
