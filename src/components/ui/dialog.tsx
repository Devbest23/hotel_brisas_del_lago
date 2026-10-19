import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

// ============================================================================
// Diálogo accesible sobre Radix (focus trap, Esc, scroll lock, ARIA).
// Dos variantes:
//  - center: modal centrado (lightbox de galería).
//  - sheet:  panel lateral (menú de navegación móvil).
// Recordatorio: incluir siempre un <DialogTitle> (visible o sr-only).
// ============================================================================

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

type DialogVariant = 'center' | 'sheet'

interface DialogContentProps {
  children: ReactNode
  className?: string
  variant?: DialogVariant
  /** Oculta el botón de cierre (cuando el contenido trae el suyo). */
  hideClose?: boolean
  /** Nombre accesible si el contenido no renderiza un título visible. */
  ariaLabel?: string
}

export function DialogContent({
  children,
  className,
  variant = 'center',
  hideClose = false,
  ariaLabel,
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="overlay-anim fixed inset-0 z-50 bg-ink/60" />
      <DialogPrimitive.Content
        aria-label={ariaLabel}
        className={cn(
          'fixed z-50 bg-surface focus:outline-none',
          variant === 'center' &&
            'dialog-anim left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-media border border-border p-6 shadow-raised dark:shadow-none',
          variant === 'sheet' &&
            'sheet-anim inset-y-0 right-0 flex h-full w-[min(20rem,85vw)] flex-col border-l border-border p-6',
          className,
        )}
      >
        {children}

        {!hideClose && (
          <DialogPrimitive.Close
            aria-label="Cerrar"
            className="absolute right-4 top-4 cursor-pointer rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
