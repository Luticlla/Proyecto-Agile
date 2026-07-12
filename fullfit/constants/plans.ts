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
    '2 días de freeze',
    'Acceso prioritario a eventos',
  ],
}

export const formatPrice = (price: number, days: number) => {
  const perMonth = Math.round(price / (days / 30))
  return {
    total: `S/ ${price}`,
    perMonth: `S/ ${perMonth}/mes`,
  }
}
