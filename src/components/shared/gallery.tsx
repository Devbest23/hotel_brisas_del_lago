import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { SmartImage } from '@/components/shared/smart-image'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { asset } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ============================================================================
// Galería con visor (lightbox).
// - Ampliable con clic/Enter (cada miniatura es un <button> con nombre accesible).
// - Navegación con flechas ← → y cierre con Esc (Radix Dialog lo garantiza).
// ============================================================================

interface GalleryImage {
  src: string
  alt: string
}

interface GalleryProps {
  images: GalleryImage[]
  className?: string
}

export function Gallery({ images, className }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const open = activeIndex !== null

  const showPrev = useCallback(() => {
    setActiveIndex((index) => (index === null ? index : (index - 1 + images.length) % images.length))
  }, [images.length])

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index === null ? index : (index + 1) % images.length))
  }, [images.length])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, showPrev, showNext])

  if (images.length === 0) return null
  const active = activeIndex !== null ? images[activeIndex] : null

  return (
    <>
      <div className={cn('grid grid-cols-2 gap-3 md:grid-cols-3', className)}>
        {images.map((image, index) => (
          <button
            key={image.src + index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Ampliar imagen: ${image.alt}`}
            className="group cursor-pointer overflow-hidden rounded-card"
          >
            <SmartImage
              src={image.src}
              alt={image.alt}
              ratio="aspect-[4/3]"
              className="transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(value) => !value && setActiveIndex(null)}>
        <DialogContent hideClose ariaLabel="Visor de imágenes" className="max-w-4xl p-0">
          <DialogTitle className="sr-only">Visor de imágenes</DialogTitle>

          {active && (
            <figure>
              <img
                src={asset(active.src)}
                alt={active.alt}
                className="max-h-[72vh] w-full rounded-t-media bg-ink/5 object-contain"
              />
              <figcaption className="px-4 py-3 pr-14 text-sm text-muted">{active.alt}</figcaption>
            </figure>
          )}

          <DialogClose
            aria-label="Cerrar visor"
            className="absolute right-3 top-3 cursor-pointer rounded-full border border-border bg-surface p-2 text-ink shadow-card transition-colors hover:bg-surface-2 dark:shadow-none"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogClose>

          {images.length > 1 && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={showPrev}
                aria-label="Imagen anterior"
                className="pointer-events-auto cursor-pointer rounded-full border border-border bg-surface/95 p-2 text-ink shadow-card transition-colors hover:bg-surface dark:shadow-none"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Imagen siguiente"
                className="pointer-events-auto cursor-pointer rounded-full border border-border bg-surface/95 p-2 text-ink shadow-card transition-colors hover:bg-surface dark:shadow-none"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
