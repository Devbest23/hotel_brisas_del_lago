import { CalendarPlus, CheckCircle2, Copy, Home, Mail, MessageCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Container } from '@/components/layout/container'
import { EmptyState } from '@/components/shared/async-state'
import { Seo } from '@/components/shared/seo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { ROUTES } from '@/lib/constants'
import { formatDateLong, nightsBetween, nightsLabel } from '@/lib/format'
import { buildIcsFile, downloadTextFile } from '@/lib/ics'
import { buildBookingMailtoUrl, buildWhatsAppUrl, type SubmittedRequest } from '@/lib/submit'

// ============================================================================
// Confirmación de la solicitud.
//
// Semántica honesta: el sitio no puede asegurar que se haya pulsado "enviar"
// en WhatsApp/correo. Por eso la página distingue:
//  - manual: "Tu solicitud está lista" (con botón para reabrir el canal).
//  - automático (Formspree): "Solicitud recibida".
// El estado llega por navigate(state) y se respalda en sessionStorage para que
// recargar la página no pierda la información.
// ============================================================================

const STORAGE_KEY = 'bdl-last-request'

function readStoredRequest(): SubmittedRequest | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SubmittedRequest
    if (!parsed?.code || !parsed?.request) return null
    return parsed
  } catch {
    return null
  }
}

export function RequestSentPage() {
  const location = useLocation()
  const { toast } = useToast()

  const submitted =
    (location.state as SubmittedRequest | null) ?? readStoredRequest()

  if (!submitted) {
    return (
      <>
        <Seo
          title="Solicitud enviada"
          description="Estado de tu solicitud de reserva."
          path={ROUTES.requestSent}
          noindex
        />
        <div className="pb-16 pt-28 md:pt-32">
          <Container>
            <EmptyState
              title="Aún no has enviado ninguna solicitud"
              description="Completa el asistente de reserva y aquí verás el resumen con tu código de referencia."
              action={
                <Button asChild>
                  <Link to={ROUTES.booking}>Ir al asistente de reserva</Link>
                </Button>
              }
            />
          </Container>
        </div>
      </>
    )
  }

  const { request, roomName, code, channel, manual } = submitted
  const nights = nightsBetween(request.checkIn, request.checkOut)

  const isWhatsApp = channel === 'whatsapp'
  const received = !manual

  const heading = received
    ? 'Solicitud recibida'
    : isWhatsApp
      ? 'Tu solicitud está lista'
      : 'Tu correo está listo'

  const handleDownloadIcs = () => {
    const content = buildIcsFile({
      code,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      roomName,
      guests: request.guests,
    })
    downloadTextFile(`brisas-del-lago-${code}.ics`, content)
    toast({
      tone: 'success',
      title: 'Recordatorio descargado',
      description: 'Abre el archivo .ics para agregarlo a tu calendario.',
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submitted.summaryText)
      toast({ tone: 'success', title: 'Resumen copiado al portapapeles' })
    } catch {
      toast({
        tone: 'error',
        title: 'No se pudo copiar automáticamente',
        description: 'Selecciona el texto del resumen y cópialo manualmente.',
      })
    }
  }

  return (
    <>
      <Seo
        title="Solicitud enviada"
        description="Resumen de tu solicitud de reserva en el Hotel Brisas del Lago."
        path={ROUTES.requestSent}
        noindex
      />

      <div className="pb-16 pt-28 md:pt-32">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
              <h1 className="font-display text-3xl font-semibold text-brand md:text-4xl">
                {heading}
              </h1>
              <p className="max-w-xl text-muted">
                {received
                  ? `Recibimos tu solicitud y te responderemos a ${request.email} en horario hábil (8 a.m.–8 p.m.).`
                  : isWhatsApp
                    ? 'Abrimos WhatsApp con el resumen de tu solicitud. Si no se abrió (bloqueador de ventanas), usa el botón de abajo y envíalo: es el último paso.'
                    : 'Abrimos tu aplicación de correo con el mensaje listo. Envíalo para completar la solicitud.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge tone={received ? 'success' : 'warning'}>
                  {received ? 'Recibida por el hotel' : 'Pendiente de envío en tu app'}
                </Badge>
                <p className="text-sm text-muted">
                  Código de referencia:{' '}
                  <span className="font-mono text-base font-semibold tracking-wide text-ink">
                    {code}
                  </span>
                </p>
              </div>
            </div>

            {/* Resumen */}
            <div className="mt-8 rounded-media border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-brand">
                Resumen de la solicitud
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Habitación</dt>
                  <dd className="text-right font-medium text-ink">{roomName}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Fechas</dt>
                  <dd className="text-right font-medium text-ink">
                    {formatDateLong(request.checkIn)} → {formatDateLong(request.checkOut)}
                    <span className="block text-xs font-normal text-muted">
                      {nightsLabel(nights)}
                    </span>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Huéspedes</dt>
                  <dd className="text-right font-medium text-ink">
                    {request.guests} {request.guests === 1 ? 'adulto' : 'adultos'}
                    {request.children > 0 &&
                      `, ${request.children} ${request.children === 1 ? 'niño' : 'niños'}`}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">A nombre de</dt>
                  <dd className="text-right font-medium text-ink">{request.fullName}</dd>
                </div>
              </dl>
            </div>

            {/* Próximos pasos */}
            <div className="mt-6 rounded-media bg-surface-2 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                ¿Qué pasa ahora?
              </h2>
              <ol className="mt-3 space-y-2.5 text-sm text-ink">
                <li className="flex gap-2.5">
                  <span className="font-semibold text-accent">1.</span>
                  {received
                    ? 'El hotel revisa la disponibilidad de tu habitación para esas fechas.'
                    : 'Envía el mensaje ya preparado en WhatsApp o en tu correo.'}
                </li>
                <li className="flex gap-2.5">
                  <span className="font-semibold text-accent">2.</span>
                  Te contactamos para confirmar fechas y tarifa final (sin cargos automáticos).
                </li>
                <li className="flex gap-2.5">
                  <span className="font-semibold text-accent">3.</span>
                  Si todo está bien, acordamos el pago directo (efectivo, transferencia o Zelle).
                </li>
              </ol>
            </div>

            {/* Acciones */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {isWhatsApp && (
                <Button asChild>
                  <a
                    href={buildWhatsAppUrl(request, roomName)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Abrir WhatsApp con el resumen
                  </a>
                </Button>
              )}

              {!isWhatsApp && manual && (
                <Button asChild>
                  <a href={buildBookingMailtoUrl(request, roomName)}>
                    <Mail className="size-4" aria-hidden="true" />
                    Abrir el correo con el resumen
                  </a>
                </Button>
              )}

              <Button variant="secondary" onClick={handleDownloadIcs}>
                <CalendarPlus className="size-4" aria-hidden="true" />
                Descargar recordatorio (.ics)
              </Button>

              <Button variant="secondary" onClick={handleCopy}>
                <Copy className="size-4" aria-hidden="true" />
                Copiar resumen
              </Button>
            </div>

            <p className="mt-8 text-center text-sm text-muted">
              Esta solicitud <strong className="font-medium text-ink">no es una reserva confirmada</strong>{' '}
              hasta que el hotel te responda. ¿Prefieres empezar de nuevo?{' '}
              <Link to={ROUTES.home} className="font-medium text-link hover:underline">
                Volver al inicio
              </Link>
              .
            </p>

            <div className="mt-4 flex justify-center">
              <Button variant="ghost" asChild>
                <Link to={ROUTES.home}>
                  <Home className="size-4" aria-hidden="true" />
                  Ir al inicio
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
