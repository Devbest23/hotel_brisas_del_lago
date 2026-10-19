import type { ReactNode } from 'react'

import { formatDateShort, formatUSD, nightsBetween, nightsLabel } from '@/lib/format'
import { cn } from '@/lib/utils'

import { useBooking, type BookingStep } from './booking-context'

// Resumen de la solicitud, siempre visible durante el asistente (aside).
// Refuerza el mensaje clave: sin cargo ahora, confirmación del hotel.

interface SummaryRowProps {
  label: string
  editStep: BookingStep
  children: ReactNode
}

function SummaryRow({ label, editStep, children }: SummaryRowProps) {
  const { goToStep } = useBooking()

  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-right">
        <div className="font-medium text-ink">{children}</div>
        <button
          type="button"
          onClick={() => goToStep(editStep)}
          aria-label={`Editar ${label.toLowerCase()}`}
          className="mt-0.5 cursor-pointer text-xs font-medium text-link hover:underline"
        >
          Editar
        </button>
      </dd>
    </div>
  )
}

export function BookingSummary({ className }: { className?: string }) {
  const { draft, selectedRoom } = useBooking()

  const nights =
    draft.checkIn && draft.checkOut ? nightsBetween(draft.checkIn, draft.checkOut) : 0
  const total = selectedRoom && nights > 0 ? selectedRoom.pricePerNight * nights : null

  return (
    <aside
      aria-label="Resumen de tu solicitud"
      className={cn('rounded-media border border-border bg-surface p-5', className)}
    >
      <h2 className="font-display text-lg font-semibold text-brand">Tu solicitud</h2>

      {nights > 0 ? (
        <dl className="mt-4 space-y-4 text-sm">
          <SummaryRow label="Fechas" editStep={1}>
            {formatDateShort(draft.checkIn)} → {formatDateShort(draft.checkOut)}
            <span className="block text-xs font-normal text-muted">{nightsLabel(nights)}</span>
          </SummaryRow>

          <SummaryRow label="Huéspedes" editStep={1}>
            {draft.guests} {draft.guests === 1 ? 'adulto' : 'adultos'}
            {draft.children > 0 && (
              <span className="block text-xs font-normal text-muted">
                {draft.children} {draft.children === 1 ? 'niño' : 'niños'}
              </span>
            )}
          </SummaryRow>

          <SummaryRow label="Habitación" editStep={2}>
            {selectedRoom ? (
              selectedRoom.name
            ) : (
              <span className="font-normal text-muted">Por elegir</span>
            )}
          </SummaryRow>
        </dl>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Elige tus fechas y tu habitación para ver aquí el resumen de la solicitud.
        </p>
      )}

      {total !== null && selectedRoom && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">
              {formatUSD(selectedRoom.pricePerNight)} × {nightsLabel(nights)}
            </span>
            <span className="font-semibold text-accent">{formatUSD(total)}</span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Total estimado, sin cargo ahora: el hotel confirma disponibilidad y tarifa final.
            Cancelación sin penalidad hasta 48 horas antes de la llegada.
          </p>
        </div>
      )}
    </aside>
  )
}
