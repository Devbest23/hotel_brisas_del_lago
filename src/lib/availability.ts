import { addDays, parseISO } from 'date-fns'

import { toISODate } from '@/lib/format'

// ============================================================================
// Disponibilidad REFERENCIAL de la demo.
//
// WHY: sin backend no existe un calendario real de ocupación. Esta función es
// DETERMINISTA (hash de habitación + fecha): la misma consulta da siempre el
// mismo resultado, así el comportamiento es reproducible y explicable.
// En la interfaz SIEMPRE se aclara que la confirmación final la da el hotel.
// Al conectar un backend real, este módulo se sustituye por una consulta HTTP.
// ============================================================================

/** Hash FNV-1a → valor entre 0 y 1 (para decisiones deterministas). */
function hash01(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

/** Probabilidad de ocupación por día: los fines de semana se llenan más. */
function occupancyFactor(dateISO: string) {
  const day = parseISO(dateISO).getDay()
  if (day === 5 || day === 6) return 0.55
  if (day === 0) return 0.4
  return 0.28
}

/** ¿La habitación está ocupada esa fecha en la demo? */
export function isDateBlocked(roomId: string, dateISO: string) {
  return hash01(`${roomId}:${dateISO}`) < occupancyFactor(dateISO)
}

/**
 * Estado de un rango [checkIn, checkOut) para una habitación.
 * - 'available': no hay fechas ocupadas en el rango.
 * - 'check': hay al menos una fecha ocupada → el hotel debe confirmar.
 */
export type RoomAvailability = 'available' | 'check'

export function getRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
): RoomAvailability {
  let cursor = parseISO(checkIn)
  const end = parseISO(checkOut)

  while (cursor < end) {
    if (isDateBlocked(roomId, toISODate(cursor))) return 'check'
    cursor = addDays(cursor, 1)
  }

  return 'available'
}
