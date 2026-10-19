import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

/** Formatea un monto entero en USD con convenciones de es-VE. */
export function formatUSD(amount: number) {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** "18 de marzo de 2026" */
export function formatDateLong(iso: string) {
  return format(parseISO(iso), "d 'de' MMMM 'de' yyyy", { locale: es })
}

/** "lun 18 mar" */
export function formatDateShort(iso: string) {
  return format(parseISO(iso), 'EEE d MMM', { locale: es })
}

// WHY: las fechas se manejan como ISO local (YYYY-MM-DD) de punta a punta.
// Así evitamos desfases al convertir a UTC en zonas horarias como America/Caracas
// (UTC-4), donde `new Date().toISOString()` puede restar un día completo.
export function toISODate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toISODate(new Date())
}

/** Noches entre dos fechas ISO (comparación por día de calendario). */
export function nightsBetween(checkIn: string, checkOut: string) {
  return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
}

/** Texto humano para la cantidad de noches: "3 noches" / "1 noche". */
export function nightsLabel(nights: number) {
  return nights === 1 ? '1 noche' : `${nights} noches`
}
