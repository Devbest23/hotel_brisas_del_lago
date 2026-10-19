import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { RoomCard } from '@/features/rooms/room-card'
import { rooms } from '@/data/rooms'
import { ROUTES } from '@/lib/constants'

// Selección de habitaciones destacadas (campo `featured` en src/data/rooms.ts).
export function FeaturedRooms() {
  const featured = rooms.filter((room) => room.featured).slice(0, 3)

  return (
    <section className="bg-surface-2 py-16 md:py-24">
      <Container wide>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Habitaciones"
            title="Elige tu vista al lago"
            description="Seis estilos de habitación, del jardín tranquilo al bungalow privado sobre el agua."
          />
          <Link
            to={ROUTES.rooms}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
          >
            Ver todas las habitaciones
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((room) => (
            <li key={room.id}>
              <RoomCard room={room} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
