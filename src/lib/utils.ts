import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Une clases condicionales y resuelve conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Pausa asíncrona: simula latencia de red en la capa de datos mock. */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// WHY: generamos códigos de solicitud legibles para repetirlos por teléfono.
// Se excluyen caracteres ambiguos (0/O, 1/I) para evitar confusiones al dictar.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Genera un código de solicitud con formato BDL-XXXX. */
export function generateRequestCode() {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const code = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
  return `BDL-${code}`
}
