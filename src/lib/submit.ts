import { CONTACT_EMAIL, FORMSPREE_ID, HOTEL, SITE_URL, WHATSAPP_NUMBER } from '@/lib/constants'
import { formatDateShort, nightsBetween, nightsLabel } from '@/lib/format'
import type { BookingRequestInput, ContactInput } from '@/lib/schemas'
import { delay, generateRequestCode } from '@/lib/utils'

// ============================================================================
// Adaptadores de envío (sitio 100% estático).
//
// La solicitud de reserva no se guarda en ninguna base de datos: viaja al hotel
// por WhatsApp (canal primario), Formspree (si está configurado) o correo.
// WHY: un único punto de salida. El día que exista backend (fase 2), solo se
// reescribe la función submitBookingRequest; los componentes no cambian.
// ============================================================================

export type SubmitChannel = 'whatsapp' | 'email'

export interface SubmittedRequest {
  code: string
  channel: SubmitChannel
  /**
   * true = el navegador no puede garantizar la entrega (se abrió WhatsApp con el
   * mensaje prellenado o el cliente de correo). La página de confirmación lo
   * explica con honestidad en lugar de decir "reserva enviada".
   */
  manual: boolean
  summaryText: string
  request: BookingRequestInput
  roomName: string
}

/** Texto plano de la solicitud: se usa en WhatsApp, correo y "copiar resumen". */
export function buildSummaryText(request: BookingRequestInput, roomName: string) {
  const nights = nightsBetween(request.checkIn, request.checkOut)
  const lines = [
    `SOLICITUD DE RESERVA — ${HOTEL.fullName}`,
    ``,
    `Habitación: ${roomName}`,
    `Llegada: ${formatDateShort(request.checkIn)} (check-in ${HOTEL.checkIn})`,
    `Salida: ${formatDateShort(request.checkOut)} (check-out ${HOTEL.checkOut})`,
    `Estancia: ${nightsLabel(nights)}`,
    `Huéspedes: ${request.guests} adulto(s)${request.children > 0 ? `, ${request.children} niño(s)` : ''}`,
    ``,
    `A nombre de: ${request.fullName}`,
    `Correo: ${request.email}`,
    `Teléfono: ${request.phone}`,
    `País: ${request.country}`,
  ]

  if (request.notes) lines.push(`Notas: ${request.notes}`)

  lines.push('', '(Sin cargo ahora. La tarifa final se confirma según disponibilidad.)')
  if (SITE_URL) lines.push(`Generado desde: ${SITE_URL}`, `Esta solicitud NO es una reserva confirmada.`)

  return lines.join('\n')
}

export function buildWhatsAppUrl(request: BookingRequestInput, roomName: string) {
  const text = buildSummaryText(request, roomName)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function buildBookingMailtoUrl(request: BookingRequestInput, roomName: string) {
  const subject = `Solicitud de reserva — ${roomName}`
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    buildSummaryText(request, roomName),
  )}`
}

/**
 * Prepara el envío de la solicitud.
 * - Si el canal es 'email' y hay Formspree configurado → POST real.
 * - Si no, devuelve la solicitud "manual": quien llama debe abrir WhatsApp o mailto.
 */
export async function submitBookingRequest(
  request: BookingRequestInput,
  roomName: string,
  channel: SubmitChannel,
): Promise<SubmittedRequest> {
  const code = generateRequestCode()
  const summaryText = buildSummaryText(request, roomName)

  // WHY: honeypot — si el campo oculto viene relleno, se descarta en silencio
  // (respuesta de éxito falsa para no dar señales al bot).
  if (request.website) {
    await delay(600)
    return { code, channel, manual: true, summaryText, request, roomName }
  }

  if (channel === 'email' && FORMSPREE_ID) {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Solicitud de reserva ${code} — ${roomName}`,
        code,
        roomName,
        ...request,
      }),
    })

    if (!response.ok) {
      throw new Error('No pudimos enviar la solicitud. Intenta de nuevo o usa WhatsApp.')
    }

    return { code, channel, manual: false, summaryText, request, roomName }
  }

  // Canal manual (WhatsApp/mailto): se simula el armado del mensaje.
  await delay(450)
  return { code, channel, manual: true, summaryText, request, roomName }
}

/** Formulario de contacto: Formspree si existe; si no, correo del visitante. */
export async function submitContactMessage(input: ContactInput): Promise<void> {
  if (input.website) {
    await delay(500)
    return
  }

  if (FORMSPREE_ID) {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: `Contacto web — ${input.subject}`, ...input }),
    })
    if (!response.ok) {
      throw new Error('No pudimos enviar tu mensaje. Intenta de nuevo en un momento.')
    }
    return
  }

  // Sin Formspree: se abre el cliente de correo con todo prellenado.
  await delay(400)
  const subject = `Contacto web — ${input.subject}`
  const body = `${input.message}\n\n— ${input.name} (${input.email})`
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
