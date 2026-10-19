import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import { Container } from '@/components/layout/container'
import { AsyncState, EmptyState, ErrorState } from '@/components/shared/async-state'
import { SectionHeading } from '@/components/shared/section-heading'
import { Seo } from '@/components/shared/seo'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RoomCard } from '@/features/rooms/room-card'
import { RoomFilters } from '@/features/rooms/room-filters'
import { formatDateLong, nightsLabel, nightsBetween } from '@/lib/format'
import { searchRooms, type RoomSearchFilters } from '@/lib/mock-api'
import { breadcrumbJsonLd } from '@/lib/seo'

// Catálogo de habitaciones con filtros sincronizados a la URL.
export function RoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: RoomSearchFilters = {
    checkIn: searchParams.get('checkIn') ?? undefined,
    checkOut: searchParams.get('checkOut') ?? undefined,
    guests: searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined,
    view: searchParams.get('view') ?? undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: (searchParams.get('sort') as RoomSearchFilters['sort']) ?? 'recommended',
  }

  const query = useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => searchRooms(filters),
  })

  const results = query.data ?? []

  const status = query.isPending
    ? 'loading'
    : query.isError
      ? 'error'
      : results.length === 0
        ? 'empty'
        : 'success'

  const nights =
    filters.checkIn && filters.checkOut ? nightsBetween(filters.checkIn, filters.checkOut) : 0

  const rangeText =
    filters.checkIn && filters.checkOut && nights > 0
      ? `${formatDateLong(filters.checkIn)} → ${formatDateLong(filters.checkOut)} · ${nightsLabel(nights)}`
      : null

  return (
    <>
      <Seo
        title="Habitaciones"
        description="Seis habitaciones frente al Lago de Maracaibo: desde la Vista Jardín hasta el Bungalow del Muelle sobre el agua. Compara precios y disponibilidad."
        path="/habitaciones"
        jsonLd={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Habitaciones', path: '/habitaciones' },
        ])}
      />

      <div className="pb-16 pt-28 md:pt-32">
        <Container wide>
          <SectionHeading
            as="h1"
            eyebrow="Catálogo"
            title="Nuestras habitaciones"
            description="Todas incluyen desayuno, WiFi de 300 Mbps y acceso a las áreas comunes frente al lago."
          />

          <div className="mt-8">
            <RoomFilters />
          </div>

          {status === 'success' && (
            <p aria-live="polite" className="mt-6 text-sm text-muted">
              <span className="font-medium text-ink">{results.length}</span>{' '}
              {results.length === 1 ? 'habitación' : 'habitaciones'}
              {rangeText ? ` · ${rangeText}` : ''}
            </p>
          )}

          <AsyncState
            className="mt-4"
            status={status}
            loading={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="space-y-3 rounded-card border border-border p-4">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ))}
              </div>
            }
            error={
              <ErrorState
                description="No pudimos cargar el catálogo de habitaciones."
                onRetry={() => query.refetch()}
              />
            }
            empty={
              <EmptyState
                title="Ninguna habitación coincide con tus filtros"
                description="Prueba ampliar el precio máximo, cambiar la vista o quitar las fechas."
                action={
                  <Button variant="secondary" onClick={() => setSearchParams({}, { replace: true })}>
                    Limpiar filtros
                  </Button>
                }
              />
            }
          >
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((room) => (
                <li key={room.id}>
                  <RoomCard
                    room={room}
                    totalPrice={room.totalPrice}
                    availability={room.availability}
                  />
                </li>
              ))}
            </ul>
          </AsyncState>

          <p className="mt-8 rounded-card border border-border bg-surface-2 p-4 text-xs leading-relaxed text-muted">
            Precios en dólares (USD) por noche, con desayuno incluido. La disponibilidad mostrada
            es referencial de la demostración: el hotel siempre confirma fechas y tarifa antes de
            cualquier pago.
          </p>
        </Container>
      </div>
    </>
  )
}
