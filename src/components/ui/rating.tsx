import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

// ============================================================================
// Calificación con estrellas.
// WHY: el color no comunica solo (WCAG 1.4.1): las estrellas son aria-hidden y
// el valor completo se expone como texto a lectores de pantalla vía role="img".
// ============================================================================

interface RatingProps {
  value: number
  count?: number
  /** 'onBand' = sobre fotografía/banda oscura (texto claro, p. ej. el hero). */
  tone?: 'default' | 'onBand'
  className?: string
}

export function Rating({ value, count, tone = 'default', className }: RatingProps) {
  const rounded = Math.round(value)
  const onBand = tone === 'onBand'
  const label = `${value.toFixed(1)} de 5 estrellas${count !== undefined ? ` (${count} reseñas)` : ''}`

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)} role="img" aria-label={label}>
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              'size-4',
              index < rounded
                ? onBand
                  ? 'fill-band-on text-band-on'
                  : 'fill-accent text-accent'
                : onBand
                  ? 'text-band-on/40'
                  : 'text-border-strong',
            )}
          />
        ))}
      </span>
      <span aria-hidden="true" className={cn('font-medium', onBand ? 'text-band-on' : 'text-ink')}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span aria-hidden="true" className={onBand ? 'text-band-on/80' : 'text-muted'}>
          ({count})
        </span>
      )}
    </span>
  )
}
