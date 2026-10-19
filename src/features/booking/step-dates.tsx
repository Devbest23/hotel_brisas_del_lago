import { parseISO } from 'date-fns'
import { useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { es } from 'react-day-picker/locale'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Select } from '@/components/ui/select'
import { BOOKING_RULES } from '@/lib/constants'
import { formatDateLong, nightsBetween, nightsLabel, todayISO, toISODate } from '@/lib/format'
import { staySchema } from '@/lib/schemas'

import { useBooking } from './booking-context'

// Paso 1 — Fechas y huéspedes.
// Calendario en línea (react-day-picker): mejor en móvil que un popover y
// accesible por teclado de fábrica. El tema visual usa nuestros tokens (globals.css).
export function StepDates() {
  const { draft, patch, goToStep } = useBooking()
  const [error, setError] = useState('')

  const range: DateRange | undefined = draft.checkIn
    ? { from: parseISO(draft.checkIn), to: draft.checkOut ? parseISO(draft.checkOut) : undefined }
    : undefined

  const nights = draft.checkIn && draft.checkOut ? nightsBetween(draft.checkIn, draft.checkOut) : 0

  const handleSelect = (next: DateRange | undefined) => {
    setError('')
    patch({
      checkIn: next?.from ? toISODate(next.from) : '',
      checkOut: next?.to ? toISODate(next.to) : '',
    })
  }

  const handleContinue = () => {
    const result = staySchema.safeParse({
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      guests: draft.guests,
      children: draft.children,
    })

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Revisa las fechas elegidas.')
      return
    }

    goToStep(2)
  }

  return (
    <section aria-labelledby="paso-fechas">
      <h2 id="paso-fechas" className="font-display text-2xl font-semibold text-brand">
        Fechas y huéspedes
      </h2>
      <p className="mt-1 text-sm text-muted">
        Máximo {BOOKING_RULES.maxNights} noches por solicitud.
      </p>

      <div className="mt-6 rounded-media border border-border bg-surface p-4 md:p-6">
        <DayPicker
          mode="range"
          locale={es}
          selected={range}
          onSelect={handleSelect}
          disabled={{ before: parseISO(todayISO()) }}
          showOutsideDays
          className="mx-auto"
        />

        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <p className="rounded-control bg-surface-2 px-3 py-2">
            <span className="text-muted">Llegada: </span>
            {draft.checkIn ? formatDateLong(draft.checkIn) : '—'}
          </p>
          <p className="rounded-control bg-surface-2 px-3 py-2">
            <span className="text-muted">Salida: </span>
            {draft.checkOut ? formatDateLong(draft.checkOut) : '—'}
          </p>
        </div>

        {nights > 0 && (
          <p className="mt-2 text-center text-sm font-medium text-success">
            {nightsLabel(nights)} seleccionadas
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Adultos" htmlFor="booking-guests" required>
          <Select
            id="booking-guests"
            value={draft.guests}
            onChange={(event) => patch({ guests: Number(event.target.value) })}
          >
            {Array.from({ length: BOOKING_RULES.maxGuests }, (_, index) => index + 1).map(
              (count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? 'adulto' : 'adultos'}
                </option>
              ),
            )}
          </Select>
        </Field>

        <Field
          label="Niños (0–11 años)"
          htmlFor="booking-children"
          hint="Los menores de 6 años se alojan gratis."
        >
          <Select
            id="booking-children"
            value={draft.children}
            onChange={(event) => patch({ children: Number(event.target.value) })}
          >
            {Array.from({ length: BOOKING_RULES.maxChildren + 1 }, (_, index) => index).map(
              (count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? 'niño' : 'niños'}
                </option>
              ),
            )}
          </Select>
        </Field>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue}>Continuar a habitaciones</Button>
      </div>
    </section>
  )
}
