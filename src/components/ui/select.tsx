import { forwardRef, type SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

// Select nativo estilizado: accesible por defecto en todos los navegadores y
// especialmente cómodo en móvil (usa el selector del sistema operativo).
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'h-11 w-full rounded-control border border-border-strong bg-surface px-3 text-sm text-ink',
          'focus-visible:border-link',
          'aria-invalid:border-danger aria-invalid:border-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    )
  },
)
