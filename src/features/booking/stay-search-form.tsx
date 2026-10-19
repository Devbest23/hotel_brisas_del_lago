import { Search } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Field, fieldA11y } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { BOOKING_RULES, ROUTES } from '@/lib/constants'
import { todayISO } from '@/lib/format'
import { staySchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'

// ============================================================================
// Buscador de estadía reutilizado en el hero y en el detalle de habitación.
// Valida con el mismo esquema Zod que el asistente de reserva (una sola verdad)
// y navega a /reservar con los parámetros en la URL (compartible y recargable).
// ============================================================================

interface StaySearchFormProps {
  initial?: { checkIn?: string; checkOut?: string; guests?: number }
  /** Si viene, la reserva continúa con esta habitación preseleccionada. */
  roomSlug?: string
  /** true = campos apilados (aside del detalle de habitación). */
  stacked?: boolean
  className?: string
}

type FieldErrors = Partial<Record<'checkIn' | 'checkOut' | 'guests', string>>

export function StaySearchForm({
  initial,
  roomSlug,
  stacked = false,
  className,
}: StaySearchFormProps) {
  const navigate = useNavigate()
  const prefix = useId()

  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? '')
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? '')
  const [guests, setGuests] = useState(initial?.guests ?? 2)
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = staySchema.safeParse({ checkIn, checkOut, guests, children: 0 })

    if (!result.success) {
      const next: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if ((key === 'checkIn' || key === 'checkOut' || key === 'guests') && !next[key]) {
          next[key] = issue.message
        }
      }
      setErrors(next)

      // Accesibilidad: el foco viaja al primer campo con error.
      const firstKey = (['checkIn', 'checkOut', 'guests'] as const).find((key) => next[key])
      if (firstKey) document.getElementById(`${prefix}-${firstKey}`)?.focus()
      return
    }

    setErrors({})
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) })
    if (roomSlug) params.set('room', roomSlug)
    navigate(`${ROUTES.booking}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        stacked
          ? 'grid gap-4'
          : 'grid gap-3 md:grid-cols-[1.1fr_1.1fr_0.9fr_auto] md:items-end',
        className,
      )}
    >
      <Field label="Llegada" htmlFor={`${prefix}-checkIn`} error={errors.checkIn} required>
        <Input
          id={`${prefix}-checkIn`}
          type="date"
          min={todayISO()}
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          {...fieldA11y(`${prefix}-checkIn`, errors.checkIn)}
        />
      </Field>

      <Field label="Salida" htmlFor={`${prefix}-checkOut`} error={errors.checkOut} required>
        <Input
          id={`${prefix}-checkOut`}
          type="date"
          min={checkIn || todayISO()}
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          {...fieldA11y(`${prefix}-checkOut`, errors.checkOut)}
        />
      </Field>

      <Field label="Huéspedes" htmlFor={`${prefix}-guests`} error={errors.guests} required>
        <Select
          id={`${prefix}-guests`}
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value))}
          {...fieldA11y(`${prefix}-guests`, errors.guests)}
        >
          {Array.from({ length: BOOKING_RULES.maxGuests }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? 'huésped' : 'huéspedes'}
            </option>
          ))}
        </Select>
      </Field>

      <Button type="submit" className="w-full md:mb-0.5 md:w-auto">
        <Search className="size-4" aria-hidden="true" />
        {stacked ? 'Consultar' : 'Buscar disponibilidad'}
      </Button>
    </form>
  )
}
