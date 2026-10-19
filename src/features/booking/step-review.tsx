import { Mail, MessageCircle, Send, type LucideIcon } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast'
import { FORMSPREE_ID, ROUTES } from '@/lib/constants'
import { formatDateLong, formatUSD, nightsBetween, nightsLabel } from '@/lib/format'
import { bookingRequestSchema } from '@/lib/schemas'
import {
  buildBookingMailtoUrl,
  buildWhatsAppUrl,
  submitBookingRequest,
  type SubmitChannel,
} from '@/lib/submit'
import { cn } from '@/lib/utils'

import { useBooking } from './booking-context'

// Paso 4 — Revisión y envío.
//
// El sitio es 100% estático: la solicitud viaja por WhatsApp (canal primario),
// Formspree (si está configurado) o correo. Aquí se elige el canal, se acepta
// el consentimiento y se hace la guardia anti doble envío.

const LAST_SUBMIT_KEY = 'bdl-last-submit'
const MIN_MS_BETWEEN_SUBMITS = 5_000

const CHANNELS: Array<{
  value: SubmitChannel
  label: string
  description: string
  icon: LucideIcon
}> = [
  {
    value: 'whatsapp',
    label: 'WhatsApp (recomendado)',
    description: 'Abre WhatsApp con el resumen listo. Tú decides cuándo enviarlo.',
    icon: MessageCircle,
  },
  {
    value: 'email',
    label: 'Correo electrónico',
    description: FORMSPREE_ID
      ? 'Se envía directamente desde este sitio.'
      : 'Abre tu aplicación de correo con el mensaje listo.',
    icon: Mail,
  },
]

export function StepReview() {
  const { draft, patch, goToStep, selectedRoom } = useBooking()
  const navigate = useNavigate()
  const { toast } = useToast()
  const honeypotId = useId()

  const [channel, setChannel] = useState<SubmitChannel>('whatsapp')
  const [termsError, setTermsError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const nights = nightsBetween(draft.checkIn, draft.checkOut)
  const total = selectedRoom ? selectedRoom.pricePerNight * nights : 0
  const roomName = selectedRoom?.name ?? 'Habitación'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = bookingRequestSchema.safeParse({
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      guests: draft.guests,
      children: draft.children,
      fullName: draft.fullName,
      email: draft.email,
      phone: draft.phone,
      country: draft.country,
      notes: draft.notes,
      website: draft.website,
      acceptTerms: draft.acceptTerms,
      roomSlug: draft.roomSlug,
    })

    if (!result.success) {
      const firstIssue = result.error.issues[0]
      if (firstIssue?.path[0] === 'acceptTerms') {
        setTermsError(firstIssue.message)
      }
      toast({
        tone: 'error',
        title: 'Faltan datos por revisar',
        description: firstIssue?.message ?? 'Revisa la información de los pasos anteriores.',
      })
      return
    }

    setTermsError('')

    // Guardia anti doble envío (además del estado `submitting`).
    const lastSubmit = Number(sessionStorage.getItem(LAST_SUBMIT_KEY) ?? 0)
    if (Date.now() - lastSubmit < MIN_MS_BETWEEN_SUBMITS) {
      toast({
        tone: 'info',
        title: 'Un momento',
        description: 'Espera unos segundos antes de reenviar la solicitud.',
      })
      return
    }

    // WHY: el canal manual se abre ANTES de cualquier await. Si se abriera
    // después, el navegador lo trataría como ventana emergente no solicitada
    // (el gesto de usuario ya habría expirado con el await) y lo bloquearía.
    if (channel === 'whatsapp') {
      window.open(buildWhatsAppUrl(result.data, roomName), '_blank', 'noopener')
    } else if (!FORMSPREE_ID) {
      window.location.href = buildBookingMailtoUrl(result.data, roomName)
    }

    setSubmitting(true)
    void (async () => {
      try {
        const submitted = await submitBookingRequest(result.data, roomName, channel)
        sessionStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()))
        sessionStorage.setItem('bdl-last-request', JSON.stringify(submitted))
        navigate(ROUTES.requestSent, { state: submitted })
      } catch (error) {
        toast({
          tone: 'error',
          title: 'No se pudo completar el envío',
          description:
            error instanceof Error ? error.message : 'Intenta de nuevo o usa WhatsApp.',
        })
      } finally {
        setSubmitting(false)
      }
    })()
  }

  return (
    <section aria-labelledby="paso-revision">
      <h2 id="paso-revision" className="font-display text-2xl font-semibold text-brand">
        Revisa y envía tu solicitud
      </h2>
      <p className="mt-1 text-sm text-muted">
        Enviar la solicitud no tiene ningún cargo: el hotel confirma primero.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Estadía</p>
          <p className="mt-2 text-sm font-medium text-ink">
            {formatDateLong(draft.checkIn)} → {formatDateLong(draft.checkOut)}
          </p>
          <p className="mt-1 text-sm text-muted">
            {nightsLabel(nights)} · {draft.guests} {draft.guests === 1 ? 'adulto' : 'adultos'}
            {draft.children > 0 &&
              ` · ${draft.children} ${draft.children === 1 ? 'niño' : 'niños'}`}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Habitación</p>
          <p className="mt-2 text-sm font-medium text-ink">{roomName}</p>
          <p className="mt-1 text-sm text-muted">
            Total estimado: <span className="font-semibold text-accent">{formatUSD(total)}</span>
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">A nombre de</p>
          <p className="mt-2 text-sm font-medium text-ink">{draft.fullName}</p>
          <p className="mt-1 text-sm text-muted">
            {draft.email} · {draft.phone} · {draft.country}
          </p>
          {draft.notes && <p className="mt-2 text-sm italic text-muted">“{draft.notes}”</p>}
        </div>
      </div>

      <Button variant="link" className="mt-3" onClick={() => goToStep(3)}>
        Editar mis datos
      </Button>

      <form onSubmit={handleSubmit} noValidate className="mt-4">
        {/* Honeypot anti-spam: fuera de pantalla, ignorado por personas */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
          <label htmlFor={honeypotId}>Sitio web (no rellenar)</label>
          <input
            id={honeypotId}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={draft.website}
            onChange={(event) => patch({ website: event.target.value })}
          />
        </div>

        <fieldset className="rounded-media border border-border bg-surface p-5">
          <legend className="px-1 text-sm font-medium text-ink">
            ¿Cómo prefieres enviar tu solicitud?
          </legend>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {CHANNELS.map((item) => {
              const Icon = item.icon
              const selected = channel === item.value
              return (
                <label
                  key={item.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors',
                    selected ? 'border-link bg-surface-2' : 'border-border hover:border-border-strong',
                  )}
                >
                  <input
                    type="radio"
                    name="channel"
                    value={item.value}
                    checked={selected}
                    onChange={() => setChannel(item.value)}
                    className="mt-1 size-4 accent-link"
                  />
                  <span>
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <Icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      {item.description}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-5">
          <label className="flex items-start gap-3 text-sm text-muted">
            <Checkbox
              checked={draft.acceptTerms}
              onChange={(event) => patch({ acceptTerms: event.target.checked })}
              aria-invalid={termsError ? true : undefined}
              aria-describedby={termsError ? 'terms-error' : undefined}
            />
            <span>
              He leído y acepto los{' '}
              <Link to={ROUTES.terms} className="font-medium text-link hover:underline">
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link to={ROUTES.privacy} className="font-medium text-link hover:underline">
                política de privacidad
              </Link>
              .
            </span>
          </label>
          {termsError && (
            <p id="terms-error" role="alert" className="mt-2 text-xs font-medium text-danger">
              {termsError}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => goToStep(3)}>
            Atrás
          </Button>
          <div className="text-right">
            <Button type="submit" loading={submitting}>
              <Send className="size-4" aria-hidden="true" />
              Enviar solicitud
            </Button>
            <p className="mt-2 text-xs text-muted">
              Respuesta del hotel en horario hábil (8 a.m.–8 p.m.)
            </p>
          </div>
        </div>
      </form>
    </section>
  )
}
