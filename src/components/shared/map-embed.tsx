import { MapPin } from 'lucide-react'
import { useState } from 'react'

import { HOTEL } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ============================================================================
// Mapa con carga diferida (click-to-load).
// WHY: un iframe de mapa pesa cientos de KB y comparte tus datos con terceros.
// Cargarlo solo cuando la persona lo pide mejora el rendimiento (Core Web
// Vitals) y es más respetuoso con la privacidad. Se usa OpenStreetMap (sin API key).
// ============================================================================

const MAP_EMBED_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=-71.6670%2C10.6350%2C-71.5850%2C10.6850&layer=mapnik&marker=10.6600%2C-71.6260'
const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=10.6600%2C-71.6260'

export function MapEmbed({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-media border border-border bg-surface-2',
        className,
      )}
    >
      {loaded ? (
        <iframe
          title={`Mapa de ubicación de ${HOTEL.fullName}`}
          src={MAP_EMBED_SRC}
          loading="lazy"
          className="h-full min-h-72 w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="flex h-full min-h-72 w-full cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center"
        >
          <MapPin className="size-8 text-brand" aria-hidden="true" />
          <span className="font-medium text-ink">Ver mapa interactivo</span>
          <span className="max-w-sm text-sm text-muted">{HOTEL.address}</span>
          <span className="text-xs text-muted">
            Se carga desde OpenStreetMap solo si lo pides (rendimiento y privacidad)
          </span>
        </button>
      )}

      <a
        href={MAP_LINK}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-3 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-link shadow-card transition-colors hover:bg-surface-2 dark:shadow-none"
      >
        Abrir en Google Maps
      </a>
    </div>
  )
}
