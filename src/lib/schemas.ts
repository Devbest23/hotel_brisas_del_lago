import { z } from 'zod'

import { BOOKING_RULES } from '@/lib/constants'
import { nightsBetween, todayISO } from '@/lib/format'

// ============================================================================
// Esquemas de validación (Zod).
// Misma fuente de verdad para el asistente de reserva y el formulario de contacto.
// Al migrar a un backend, estos esquemas se reutilizan en el servidor.
// ============================================================================

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')

/** Paso 1 — Fechas y huéspedes. */
export const staySchema = z
  .object({
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.coerce
      .number()
      .int()
      .min(BOOKING_RULES.minGuests, 'Mínimo 1 huésped.')
      .max(BOOKING_RULES.maxGuests, `Máximo ${BOOKING_RULES.maxGuests} huéspedes.`),
    children: z.coerce
      .number()
      .int()
      .min(0)
      .max(BOOKING_RULES.maxChildren, `Máximo ${BOOKING_RULES.maxChildren} niños.`),
  })
  .superRefine((data, ctx) => {
    if (data.checkIn < todayISO()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['checkIn'],
        message: 'La llegada no puede ser una fecha pasada.',
      })
    }

    const nights = nightsBetween(data.checkIn, data.checkOut)

    if (nights <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['checkOut'],
        message: 'La salida debe ser posterior a la llegada.',
      })
    } else if (nights > BOOKING_RULES.maxNights) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['checkOut'],
        message: `Máximo ${BOOKING_RULES.maxNights} noches por solicitud.`,
      })
    }
  })

/** Paso 3 — Datos del huésped. */
export const guestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Escribe tu nombre completo.')
    .max(80, 'Máximo 80 caracteres.'),
  email: z.string().trim().email('Escribe un correo válido.'),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s()-]{7,20}$/, 'Teléfono inválido. Incluye el código del país.'),
  country: z.string().trim().min(2, 'Indica tu país.').max(60),
  notes: z.string().trim().max(500, 'Máximo 500 caracteres.').optional(),
  // WHY: honeypot. El campo está oculto para personas; si un bot lo rellena,
  // el envío se descarta silenciosamente (ver submit.ts / capa de envío).
  website: z.string().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos y la política de privacidad.' }),
  }),
})

/** Solicitud de reserva completa (pasos 1 + 3 + habitación elegida). */
export const bookingRequestSchema = staySchema
  .and(guestSchema)
  .and(z.object({ roomSlug: z.string().min(1, 'Elige una habitación.') }))

/** Datos del huésped sin el consentimiento (el consentimiento se pide en el paso 4). */
export const guestFieldsSchema = guestSchema.omit({ acceptTerms: true })

/** Formulario de contacto. */
export const contactSchema = z.object({
  name: z.string().trim().min(3, 'Escribe tu nombre.').max(80),
  email: z.string().trim().email('Escribe un correo válido.'),
  subject: z.enum(['reserva', 'eventos', 'prensa', 'otro'], {
    errorMap: () => ({ message: 'Elige un asunto.' }),
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Cuéntanos un poco más (mínimo 10 caracteres).')
    .max(800, 'Máximo 800 caracteres.'),
  website: z.string().optional(),
})

export type StayInput = z.infer<typeof staySchema>
export type GuestInput = z.infer<typeof guestSchema>
export type BookingRequestInput = z.infer<typeof bookingRequestSchema>
export type ContactInput = z.infer<typeof contactSchema>
