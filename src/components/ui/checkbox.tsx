import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

// Checkbox nativo con accent-color del token de enlace: sin JavaScript,
// accesible por teclado y con un área táctil cómoda.
export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'size-5 shrink-0 cursor-pointer rounded accent-link disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    )
  },
)
