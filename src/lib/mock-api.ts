import { MOCK_FORCE_ERROR } from '@/lib/constants'
import { getRoomAvailability, type RoomAvailability } from '@/lib/availability'
import { nightsBetween } from '@/lib/format'
import { delay } from '@/lib/utils'

import { rooms, type Room } from '@/data/rooms'

// ============================================================================
// Capa de datos simulada (mock API).
//
// WHY: simula una API real CON latencia y posibilidad de error para que los
// estados de carga/error/vacío de la interfaz sean auténticos (requisito del
// proyecto). Migrar a un backend real = reescribir SOLO este archivo; el resto
// de la aplicación no cambia (TanStack Query cancela, reintenta y cachea igual).
// ============================================================================

export type RoomSort = 'recommended' | 'price-asc' | 'price-desc'

export interface RoomSearchFilters {
  checkIn?: string
  checkOut?: string
  guests?: number
  view?: string
  maxPrice?: number
  sort?: RoomSort
}

export type RoomSearchResult = Room & {
  /** null cuando no se consultaron fechas */
  availability: RoomAvailability | null
  /** Total estimado (precio × noches) o null sin fechas */
  totalPrice: number | null
}

/** QA: con VITE_MOCK_FORCE_ERROR=true se demuestra el estado de error con reintento. */
function maybeFail() {
  if (MOCK_FORCE_ERROR) {
    throw new Error('Error de red simulado para demostrar el estado de error.')
  }
}

export async function searchRooms(filters: RoomSearchFilters): Promise<RoomSearchResult[]> {
  await delay(550)
  maybeFail()

  const nights =
    filters.checkIn && filters.checkOut ? nightsBetween(filters.checkIn, filters.checkOut) : 0

  const matches = rooms.filter((room) => {
    if (filters.guests && room.capacity < filters.guests) return false
    if (filters.view && room.view !== filters.view) return false
    if (filters.maxPrice && room.pricePerNight > filters.maxPrice) return false
    return true
  })

  const results: RoomSearchResult[] = matches.map((room) => ({
    ...room,
    availability:
      filters.checkIn && filters.checkOut && nights > 0
        ? getRoomAvailability(room.id, filters.checkIn, filters.checkOut)
        : null,
    totalPrice: nights > 0 ? room.pricePerNight * nights : null,
  }))

  const sorted = [...results]
  if (filters.sort === 'price-asc') {
    sorted.sort((a, b) => a.pricePerNight - b.pricePerNight)
  } else if (filters.sort === 'price-desc') {
    sorted.sort((a, b) => b.pricePerNight - a.pricePerNight)
  } else {
    // "Recomendado": destacadas primero, luego mejor calificadas.
    sorted.sort(
      (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
    )
  }

  return sorted
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  await delay(420)
  maybeFail()
  return rooms.find((room) => room.slug === slug) ?? null
}

export async function getRelatedRooms(slug: string, count = 3): Promise<Room[]> {
  await delay(350)
  maybeFail()
  return rooms.filter((room) => room.slug !== slug).slice(0, count)
}
