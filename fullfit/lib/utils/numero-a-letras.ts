const UNIDADES = [
  '', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO',
  'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
  'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE',
  'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE'
]

const DECENAS = [
  '', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA',
  'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA', 'CIEN'
]

const CENTENAS = [
  '', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS',
  'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'
]

function convertirBloque(n: number): string {
  if (n === 0) return ''
  if (n === 100) return 'CIEN'

  let resultado = ''

  const centena = Math.floor(n / 100)
  const decena = Math.floor((n % 100) / 10)
  const unidad = n % 10

  if (centena > 0) {
    resultado += CENTENAS[centena]
    if (decena > 0 || unidad > 0) resultado += ' '
  }

  if (decena === 1) {
    resultado += UNIDADES[10 + unidad]
  } else if (decena === 2 && unidad > 0) {
    resultado += `VEINTI${UNIDADES[unidad]}`
  } else if (decena > 0) {
    resultado += DECENAS[decena]
    if (unidad > 0) resultado += ' Y '
  }

  if (decena !== 1 && unidad > 0) {
    resultado += UNIDADES[unidad]
  }

  return resultado.trim()
}

export function montoEnLetras(monto: number): string {
  if (monto === 0) return 'CERO SOLES'

  const parteEntera = Math.floor(monto)
  const parteDecimal = Math.round((monto - parteEntera) * 100)

  let resultado = ''

  const millones = Math.floor(parteEntera / 1000000)
  const miles = Math.floor((parteEntera % 1000000) / 1000)
  const unidades = parteEntera % 1000

  if (millones > 0) {
    if (millones === 1) {
      resultado += 'UN MILLON'
    } else {
      resultado += `${convertirBloque(millones)} MILLONES`
    }
    if (miles > 0 || unidades > 0) resultado += ' '
  }

  if (miles > 0) {
    if (miles === 1) {
      resultado += 'MIL'
    } else {
      resultado += `${convertirBloque(miles)} MIL`
    }
    if (unidades > 0) resultado += ' '
  }

  if (unidades > 0) {
    resultado += convertirBloque(unidades)
  }

  resultado += ' SOLES'

  if (parteDecimal > 0) {
    resultado += ` Y ${parteDecimal.toString().padStart(2, '0')}/100`
  }

  return resultado
}
