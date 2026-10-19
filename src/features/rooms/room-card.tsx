import { Link } from 'react-router-dom'

import { SmartImage } from '@/components/shared/smart-image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'
import type { Room } from '@/data/rooms'
import { ROUTES } from '@/lib/constants'
import { formatUSD } from '@/lib/format'

// Tarjeta de habitación: componente de conversión usado en la landing y en el catálogo.
interface RoomCardProps {
  room: Room
  /** Total estimado para el rango de fechas consultado (opcional). */
  totalPrice?: number | null
  /** Disponibilidad referencial (opcional, solo cuando se consultaron fechas). */
  availability?: 'available' | 'check' | null
}

export function RoomCard({ room, totalPrice, availability }: RoomCardProps) {
  const image = room.images[0]

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-raised dark:shadow-none dark:hover:border-border-strong">
      <SmartImage
        src={image.src}
        alt={image.alt}
        ratio="aspect-[4/3]"
        className="transition-transform duration-300 group-hover:scale-[1.03]"
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-brand">
            <Link
              to={ROUTES.roomDetail(room.slug)}
              className="transition-colors hover:text-accent"
            >
              {room.name}
            </Link>
          </h3>
          <Rating value={room.rating} className="shrink-0" />
        </div>

        <p className="text-sm text-muted">
          Hasta {room.capacity} huéspedes · {room.sizeM2} m² · {room.beds} · Vista{' '}
          {room.view}
        </p>

        <p className="flex-1 text-sm leading-relaxed text-muted">{room.description}</p>

        {availability && (
          <p
            className={
              availability === 'available'
                ? 'text-xs font-medium text-success'
                : 'text-xs font-medium text-warning'
            }
          >
            {availability === 'available'
              ? '● Disponible para tus fechas (referencial)'
              : '● Consultar disponibilidad para tus fechas'}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted">
            desde{' '}
            <span className="text-lg font-semibold text-accent">
              {formatUSD(room.pricePerNight)}
            </span>{' '}
            / noche
            {typeof totalPrice === 'number' && totalPrice > 0 && (
              <span className="block text-xs">≈ {formatUSD(totalPrice)} por la estancia</span>
            )}
          </p>
          <Button asChild variant="secondary" size="sm">
            <Link to={ROUTES.roomDetail(room.slug)} aria-label={`Ver detalle de ${room.name}`}>
              Ver detalle
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
