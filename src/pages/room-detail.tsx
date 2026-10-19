import { useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { Container } from '@/components/layout/container'
import { EmptyState, ErrorState } from '@/components/shared/async-state'
import { Gallery } from '@/components/shared/gallery'
import { SectionHeading } from '@/components/shared/section-heading'
import { Seo } from '@/components/shared/seo'
import { Accordion, type AccordionEntry } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'
import { Skeleton } from '@/components/ui/skeleton'
import { StaySearchForm } from '@/features/booking/stay-search-form'
import { RoomCard } from '@/features/rooms/room-card'
import { ROUTES } from '@/lib/constants'
import { formatUSD } from '@/lib/format'
import { getRelatedRooms, getRoomBySlug } from '@/lib/mock-api'
import { breadcrumbJsonLd, roomJsonLd } from '@/lib/seo'

// Reglas comunes del hotel (contenido mock editable).
const HOUSE_RULES: AccordionEntry[] = [
  {
    id: 'rule-check',
    title: 'Check-in y check-out',
    content: (
      <p>
        Check-in desde las 3:00 p.m.; check-out hasta las 12:00 p.m. (mediodía). Si llegas antes,
        guardamos tu equipaje sin costo mientras disfrutas de la terraza.
      </p>
    ),
  },
  {
    id: 'rule-smoke',
    title: 'Espacios libres de humo',
    content: (
      <p>
        No se permite fumar dentro de las habitaciones ni en áreas cerradas. Hay zonas designadas
        al aire libre.
      </p>
    ),
  },
  {
    id: 'rule-quiet',
    title: 'Silencio nocturno',
    content: (
      <p>
        De 10:00 p.m. a 7:00 a.m. pedimos mantener un volumen bajo para el descanso de todas las
        personas.
      </p>
    ),
  },
  {
    id: 'rule-pets',
    title: 'Mascotas',
    content: (
      <p>
        Aceptamos mascotas pequeñas (hasta 10 kg) en habitaciones de planta baja, con consulta
        previa al hotel.
      </p>
    ),
  },
  {
    id: 'rule-cancel',
    title: 'Cancelación flexible',
    content: (
      <p>
        Puedes cancelar sin penalidad hasta 48 horas antes de la llegada escribiendo al hotel por
        WhatsApp o correo.
      </p>
    ),
  },
]

export function RoomDetailPage() {
  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()

  const roomQuery = useQuery({
    queryKey: ['room', slug],
    queryFn: () => getRoomBySlug(slug),
  })

  const relatedQuery = useQuery({
    queryKey: ['rooms', 'related', slug],
    queryFn: () => getRelatedRooms(slug),
    enabled: Boolean(roomQuery.data),
  })

  if (roomQuery.isPending) {
    return (
      <div className="pb-16 pt-28 md:pt-32">
        <Seo
          title="Habitación"
          description="Detalle de habitación del Hotel Brisas del Lago."
          path={ROUTES.rooms}
          noindex
        />
        <Container wide>
          <Skeleton className="h-4 w-64" />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <Skeleton className="aspect-[4/3] w-full rounded-media" />
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-80 w-full rounded-media" />
          </div>
        </Container>
      </div>
    )
  }

  if (roomQuery.isError) {
    return (
      <div className="pb-16 pt-28 md:pt-32">
        <Container>
          <ErrorState
            description="No pudimos cargar esta habitación."
            onRetry={() => roomQuery.refetch()}
          />
        </Container>
      </div>
    )
  }

  const room = roomQuery.data

  if (!room) {
    return (
      <>
        <Seo
          title="Habitación no encontrada"
          description="La habitación que buscas no existe o cambió de dirección."
          path={ROUTES.rooms}
          noindex
        />
        <div className="pb-16 pt-28 md:pt-32">
          <Container>
            <EmptyState
              title="No encontramos esa habitación"
              description="Puede que el enlace esté mal escrito o que la habitación ya no esté publicada."
              action={
                <Button asChild>
                  <Link to={ROUTES.rooms}>Ver todas las habitaciones</Link>
                </Button>
              }
            />
          </Container>
        </div>
      </>
    )
  }

  const initialGuests = searchParams.get('guests')

  return (
    <>
      <Seo
        title={room.name}
        description={room.description}
        path={ROUTES.roomDetail(room.slug)}
        image={room.images[0].src}
        jsonLd={[
          roomJsonLd(room),
          breadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: 'Habitaciones', path: ROUTES.rooms },
            { name: room.name, path: ROUTES.roomDetail(room.slug) },
          ]),
        ]}
      />

      <article className="pb-16 pt-28 md:pt-32">
        <Container wide>
          <nav aria-label="Ruta de navegación" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to={ROUTES.home} className="transition-colors hover:text-link">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to={ROUTES.rooms} className="transition-colors hover:text-link">
                  Habitaciones
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink">
                {room.name}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
            <div className="space-y-10">
              <Gallery images={room.images} />

              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl font-semibold text-brand md:text-4xl">
                      {room.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      <Rating value={room.rating} count={room.reviewCount} />
                      <span aria-hidden="true">·</span>
                      <span>Hasta {room.capacity} huéspedes</span>
                      <span aria-hidden="true">·</span>
                      <span>{room.sizeM2} m²</span>
                      <span aria-hidden="true">·</span>
                      <span>Vista {room.view}</span>
                    </div>
                  </div>

                  <p className="text-right">
                    <span className="font-display text-2xl font-semibold text-accent">
                      {formatUSD(room.pricePerNight)}
                    </span>
                    <span className="block text-xs text-muted">por noche (USD)</span>
                  </p>
                </div>

                <p className="prose-bdl mt-5">{room.longDescription}</p>
              </div>

              <section aria-labelledby="incluye">
                <h2 id="incluye" className="font-display text-2xl font-semibold text-brand">
                  Qué incluye
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {room.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center gap-2.5 text-sm text-ink">
                      <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="reglas">
                <h2 id="reglas" className="font-display text-2xl font-semibold text-brand">
                  Reglas de la casa
                </h2>
                <div className="mt-2">
                  <Accordion items={HOUSE_RULES} />
                </div>
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <Card className="p-5">
                <p className="font-display text-lg font-semibold text-brand">
                  Consulta estas fechas
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  La disponibilidad y la tarifa final las confirma el hotel antes de cualquier
                  pago.
                </p>
                <StaySearchForm
                  stacked
                  className="mt-4"
                  roomSlug={room.slug}
                  initial={{
                    checkIn: searchParams.get('checkIn') ?? undefined,
                    checkOut: searchParams.get('checkOut') ?? undefined,
                    guests: initialGuests ? Number(initialGuests) : undefined,
                  }}
                />
              </Card>

              <Card className="p-5 text-sm text-muted">
                <p className="font-medium text-ink">¿Dudas antes de reservar?</p>
                <p className="mt-1">
                  Escríbenos y te ayudamos a elegir la habitación ideal para tus fechas.
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-3">
                  <Link to={ROUTES.contact}>Ir a contacto</Link>
                </Button>
              </Card>
            </aside>
          </div>

          {relatedQuery.data && relatedQuery.data.length > 0 && (
            <section className="mt-16" aria-labelledby="otras-habitaciones">
              <SectionHeading eyebrow="También te puede gustar" title="Otras habitaciones" />
              <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedQuery.data.map((item) => (
                  <li key={item.id}>
                    <RoomCard room={item} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Container>
      </article>
    </>
  )
}
