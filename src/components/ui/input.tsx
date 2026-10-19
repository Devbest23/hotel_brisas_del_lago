import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

// Input de texto base. El borde usa --border-strong (≥3:1, WCAG 1.4.11 no-texto).
// El estado de error se marca con aria-invalid + utilidades (ver ui/field.tsx).
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-control border border-border-strong bg-surface px-3.5 text-sm text-ink',
          'placeholder:text-muted/70',
          'focus-visible:border-link',
          'aria-invalid:border-danger aria-invalid:border-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    )
  },
)
