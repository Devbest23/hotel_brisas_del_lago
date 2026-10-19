import { useState, type ImgHTMLAttributes } from 'react'

import { asset } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ============================================================================
// Imagen con carga diferida y respaldo local.
// - aplica el prefijo BASE_URL (funciona en GitHub Pages, subdirectorio incluido);
// - carga perezosa excepto para la imagen LCP (eager);
// - si una foto no existe, muestra el placeholder SVG del sistema.
// ============================================================================

const FALLBACK_IMAGE = '/images/placeholder.svg'

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'loading'> {
  src: string
  alt: string
  /** Clase del contenedor cuando se usa `ratio` (evita el salto de layout, CLS). */
  wrapperClassName?: string
  /** Clase de proporción, ej. 'aspect-[4/3]' o 'aspect-video'. */
  ratio?: string
  /** true solo para la imagen LCP (hero): carga inmediata y prioridad alta. */
  eager?: boolean
}

export function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  ratio,
  eager = false,
  onError,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  const image = (
    <img
      src={asset(failed ? FALLBACK_IMAGE : src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => {
        setFailed(true)
        onError?.(event)
      }}
      className={cn('h-full w-full object-cover', className)}
      {...props}
    />
  )

  if (!ratio) return image

  return (
    <div className={cn(ratio, 'overflow-hidden bg-surface-2', wrapperClassName)}>{image}</div>
  )
}
