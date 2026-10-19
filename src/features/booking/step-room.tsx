import { useQuery } from '@tanstack/react-query'

import { AsyncState, EmptyState, ErrorState } from '@/components/shared/async-state'
import { SmartImage } from '@/components/shared/smart-image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateShort, formatUSD, nightsBetween, nightsLabel } from '@/lib/format'
import { searchRooms } from '@/lib/mock-api'
import { cn } from '@/lib/utils'

import { useBooking } from './booking-context'

// Paso 2 — Elección de habitación para las fechas y huéspedes del paso 1.
// La consulta pasa por la capa mock (latencia simulada) → estados reales de
// carga / error / vacío con TanStack Query.
export function StepRoom() {
  const { draft, patch, goToStep } = useBooking()

  const nights = nightsBetween(draft.checkIn, draft.checkOut)

  const query = useQuery({
    queryKey: [
      'rooms',
      { checkIn: draft.checkIn, checkOut: draft.checkOut, guests: draft.guests },
    ],
    queryFn: () =>
      searchRooms({ checkIn: draft.checkIn, checkOut: draft.checkOut, guests: draft.guests }),
  })

  const status = query.isPending
    ? 'loading'
    : query.isError
      ? 'error'
      : query.data.length === 0
        ? 'empty'
        : 'success'

  return (
    <section aria-labelledby="paso-habitacion">
      <h2 id="paso-habitacion" className="font-display text-2xl font-semibold text-brand">
        Elige tu habitación
      </h2>
      <p className="mt-1 text-sm text-muted">
        {draft.checkIn && draft.checkOut
          ? `${formatDateShort(draft.checkIn)} → ${formatDateShort(draft.checkOut)} · ${nightsLabel(nights)} · ${draft.guests} ${draft.guests === 1 ? 'huésped' : 'huéspedes'}`
          : 'Ajusta primero tus fechas.'}
      </p>

      <AsyncState
        className="mt-6"
        status={status}
        loading={
          <div className="grid gap-4" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex gap-4 rounded-media border border-border p-3">
                <Skeleton className="h-24 w-28 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        }
        error={
          <ErrorState
            description="No pudimos consultar la disponibilidad."
            onRetry={() => query.refetch()}
          />
        }
        empty={
          <EmptyState
            title="No hay habitaciones para esos criterios"
            description="Prueba con menos huéspedes o ajusta las fechas."
            action={
              <Button variant="secondary" onClick={() => goToStep(1)}>
                Ajustar fechas
              </Button>
            }
          />
        }
      >
        <ul className="grid gap-4">
          {query.data?.map((room) => {
            const selected = draft.roomSlug === room.slug

            return (
              <li key={room.id}>
                <button
                  type="button"
                  onClick={() => patch({ roomSlug: room.slug })}
                  aria-pressed={selected}
                  className={cn(
                    'flex w-full cursor-pointer gap-4 rounded-media border p-3 text-left transition-colors',
                    selected
                      ? 'border-link ring-1 ring-link'
                      : 'border-border bg-surface hover:border-border-strong',
                  )}
                >
                  <SmartImage
                    src={room.images[0].src}
                    alt=""
                    ratio="aspect-[4/3]"
                    wrapperClassName="w-28 shrink-0 rounded-control sm:w-36"
                  />

                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display text-lg font-semibold text-brand">{room.name}</p>
                      <p className="shrink-0 text-right text-sm">
                        <span className="font-semibold text-accent">
                          {formatUSD(room.pricePerNight)}
                        </span>
                        <span className="block text-xs text-muted">/ noche</span>
                      </p>
                    </div>

                    <p className="text-xs text-muted">
                      {room.capacity} huéspedes · {room.sizeM2} m² · {room.beds} · Vista{' '}
                      {room.view}
                    </p>

                    <Badge tone={room.availability === 'available' ? 'success' : 'warning'}>
                      {room.availability === 'available'
                        ? 'Disponible para tus fechas'
                        : 'Sujeta a confirmación del hotel'}
                    </Badge>

                    {typeof room.totalPrice === 'number' && room.totalPrice > 0 && (
                      <p className="text-xs text-muted">
                        ≈ <span className="font-medium text-ink">{formatUSD(room.totalPrice)}</span>{' '}
                        por {nightsLabel(nights)}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          La disponibilidad mostrada es referencial (demostración sin sistema de reservas en
          línea): el hotel confirma fechas y tarifa antes de cualquier pago.
        </p>
      </AsyncState>

      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={() => goToStep(1)}>
          Atrás
        </Button>
        <Button disabled={!draft.roomSlug} onClick={() => goToStep(3)}>
          Continuar a tus datos
        </Button>
      </div>
    </section>
  )
}
