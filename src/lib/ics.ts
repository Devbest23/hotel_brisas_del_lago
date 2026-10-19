import { HOTEL } from '@/lib/constants'

// ============================================================================
// Generación de archivo .ics (calendario) para la solicitud enviada.
// Compatible con Google Calendar, Apple Calendar y Outlook.
// ============================================================================

interface IcsInput {
  code: string
  checkIn: string // YYYY-MM-DD
  checkOut: string // YYYY-MM-DD
  roomName: string
  guests: number
}

function compactDate(iso: string) {
  return iso.replace(/-/g, '')
}

export function buildIcsFile({ code, checkIn, checkOut, roomName, guests }: IcsInput) {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Brisas del Lago//Solicitud de reserva//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${code}-brisasdellago`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compactDate(checkIn)}`,
    `DTEND;VALUE=DATE:${compactDate(checkOut)}`,
    `SUMMARY:Estadía en ${HOTEL.fullName} (${code})`,
    `LOCATION:${HOTEL.address}`,
    `DESCRIPTION:Solicitud de reserva para ${roomName}, ${guests} huésped(es). PENDIENTE de confirmación del hotel.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join('\r\n')
}

/** Descarga un archivo de texto generado en memoria (Blob + URL temporal). */
export function downloadTextFile(filename: string, content: string, mimeType = 'text/calendar;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // WHY: liberar el blob evita retener memoria en sesiones largas.
  URL.revokeObjectURL(url)
}
