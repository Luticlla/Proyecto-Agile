import { MercadoPagoConfig } from 'mercadopago'

let client: MercadoPagoConfig | null = null

export function getMercadoPagoClient(): MercadoPagoConfig {
  if (!client) {
    client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    })
  }
  return client
}
