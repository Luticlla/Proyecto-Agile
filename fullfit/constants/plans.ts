export const planFeatures: Record<string, string[]> = {
  'Mensual': [
    'Acceso a toda la sede',
    'Área de pesas y máquinas',
    'Vestuarios y locker',
    'App de seguimiento',
  ],
  'Trimestral': [
    'Acceso a toda la sede',
    'Área de pesas y máquinas',
    'Clases grupales ilimitadas',
    'App de seguimiento',
    'Evaluación corporal mensual',
  ],
  'Anual': [
    'Acceso a toda la sede',
    'Área de pesas y máquinas',
    'Clases grupales ilimitadas',
    'App de seguimiento',
    'Evaluación corporal mensual',
    'Hasta 2 suspensiones temporales (Freeze)',
    'Acceso prioritario a eventos',
  ],
}

export const FREEZE_DIAS_MAXIMO: Record<string, number> = {
  'Mensual': 5,
  'Trimestral': 30,
  'Anual': 60,
}

export const formatPrice = (price: number, days: number) => {
  const perMonth = Math.round(price / (days / 30))
  return {
    total: `S/ ${price}`,
    perMonth: `S/ ${perMonth}/mes`,
  }
}
