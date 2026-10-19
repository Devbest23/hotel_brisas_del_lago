import { useId } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { roomViews } from '@/data/rooms'
import { BOOKING_RULES } from '@/lib/constants'
import { todayISO } from '@/lib/format'

// ============================================================================
// Filtros del catálogo sincronizados con la URL (?checkIn=…&guests=…).
// WHY en la URL: el estado es compartible, el botón "atrás" del navegador
// funciona y recargar la página conserva los filtros.
// ============================================================================

const FILTER_KEYS = ['checkIn', 'checkOut', 'guests', 'view', 'maxPrice', 'sort'] as const

export function RoomFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const id = useId()

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const hasFilters = FILTER_KEYS.some((key) => searchParams.has(key))
  const checkIn = searchParams.get('checkIn') ?? ''

  return (
    <Card className="p-4 md:p-5">
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Field label="Llegada" htmlFor={`${id}-checkIn`}>
          <Input
            id={`${id}-checkIn`}
            type="date"
            min={todayISO()}
            value={checkIn}
            onChange={(event) => update('checkIn', event.target.value)}
          />
        </Field>

        <Field label="Salida" htmlFor={`${id}-checkOut`}>
          <Input
            id={`${id}-checkOut`}
            type="date"
            min={checkIn || todayISO()}
            value={searchParams.get('checkOut') ?? ''}
            onChange={(event) => update('checkOut', event.target.value)}
          />
        </Field>

        <Field label="Huéspedes" htmlFor={`${id}-guests`}>
          <Select
            id={`${id}-guests`}
            value={searchParams.get('guests') ?? ''}
            onChange={(event) => update('guests', event.target.value)}
          >
            <option value="">Cualquiera</option>
            {Array.from({ length: BOOKING_RULES.maxGuests }, (_, i) => i + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'huésped' : 'huéspedes'}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Vista" htmlFor={`${id}-view`}>
          <Select
            id={`${id}-view`}
            value={searchParams.get('view') ?? ''}
            onChange={(event) => update('view', event.target.value)}
          >
            <option value="">Todas</option>
            {roomViews.map((view) => (
              <option key={view.value} value={view.value}>
                {view.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Precio máx. por noche" htmlFor={`${id}-maxPrice`}>
          <Input
            id={`${id}-maxPrice`}
            type="number"
            min={50}
            step={10}
            inputMode="numeric"
            placeholder="Sin límite"
            value={searchParams.get('maxPrice') ?? ''}
            onChange={(event) => update('maxPrice', event.target.value)}
          />
        </Field>

        <Field label="Ordenar por" htmlFor={`${id}-sort`}>
          <Select
            id={`${id}-sort`}
            value={searchParams.get('sort') ?? 'recommended'}
            onChange={(event) =>
              update('sort', event.target.value === 'recommended' ? '' : event.target.value)
            }
          >
            <option value="recommended">Recomendado</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </Select>
        </Field>
      </div>

      {hasFilters && (
        <div className="mt-4 flex justify-end border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={() => setSearchParams({}, { replace: true })}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </Card>
  )
}
