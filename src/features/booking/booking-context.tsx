import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

import { rooms, type Room } from '@/data/rooms'

// ============================================================================
// Estado del asistente de reserva (borrador de la solicitud).
//
// WHY context + reducer: los 4 pasos y el resumen lateral comparten un único
// estado predecible; sin librerías externas de estado.
//
// WHY sessionStorage: si la persona recarga la página o vuelve desde WhatsApp,
// conserva lo que escribió en esa pestaña. Se descarta al cerrar el navegador
// (privacidad) y nunca sale del dispositivo.
// ============================================================================

export type BookingStep = 1 | 2 | 3 | 4

export interface BookingDraft {
  step: BookingStep
  checkIn: string
  checkOut: string
  guests: number
  children: number
  roomSlug: string
  fullName: string
  email: string
  phone: string
  country: string
  notes: string
  /** Honeypot anti-spam: siempre vacío en uso humano. */
  website: string
  acceptTerms: boolean
}

type BookingAction =
  | { type: 'patch'; patch: Partial<BookingDraft> }
  | { type: 'goToStep'; step: BookingStep }
  | { type: 'reset' }

const STORAGE_KEY = 'bdl-booking-draft'

const EMPTY_DRAFT: BookingDraft = {
  step: 1,
  checkIn: '',
  checkOut: '',
  guests: 2,
  children: 0,
  roomSlug: '',
  fullName: '',
  email: '',
  phone: '',
  country: 'Venezuela',
  notes: '',
  website: '',
  acceptTerms: false,
}

function reducer(state: BookingDraft, action: BookingAction): BookingDraft {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.patch }
    case 'goToStep':
      return { ...state, step: action.step }
    case 'reset':
      return EMPTY_DRAFT
  }
}

function loadInitialDraft(initial: Partial<BookingDraft>): BookingDraft {
  let stored: Partial<BookingDraft> = {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) stored = JSON.parse(raw) as Partial<BookingDraft>
  } catch {
    stored = {}
  }

  const merged: BookingDraft = { ...EMPTY_DRAFT, ...stored, ...initial }

  // Nunca heredar el honeypot ni un paso inválido.
  merged.website = ''
  if (![1, 2, 3, 4].includes(merged.step)) merged.step = 1

  return merged
}

interface BookingContextValue {
  draft: BookingDraft
  patch: (patch: Partial<BookingDraft>) => void
  goToStep: (step: BookingStep) => void
  reset: () => void
  /** Habitación elegida, resuelta desde el catálogo. */
  selectedRoom: Room | null
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking debe usarse dentro de <BookingProvider>')
  return context
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams()

  const [draft, dispatch] = useReducer(reducer, undefined, () => {
    const initial: Partial<BookingDraft> = {}
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const guests = searchParams.get('guests')
    const children = searchParams.get('children')
    const room = searchParams.get('room')

    if (checkIn) initial.checkIn = checkIn
    if (checkOut) initial.checkOut = checkOut
    if (guests) initial.guests = Number(guests)
    if (children) initial.children = Number(children)
    if (room && rooms.some((item) => item.slug === room)) initial.roomSlug = room

    // Llegar con fechas (y quizá habitación) desde el buscador adelanta el paso:
    // se respeta lo que la persona ya eligió en vez de pedirlo de nuevo.
    if (initial.checkIn && initial.checkOut) {
      initial.step = initial.roomSlug ? 3 : 2
    }

    return loadInitialDraft(initial)
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      /* modo privado: el borrador vive solo en memoria */
    }
  }, [draft])

  const value = useMemo<BookingContextValue>(
    () => ({
      draft,
      patch: (patch) => dispatch({ type: 'patch', patch }),
      goToStep: (step) => dispatch({ type: 'goToStep', step }),
      reset: () => dispatch({ type: 'reset' }),
      selectedRoom: rooms.find((room) => room.slug === draft.roomSlug) ?? null,
    }),
    [draft],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
