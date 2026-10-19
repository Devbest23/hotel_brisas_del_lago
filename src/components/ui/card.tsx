import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

// Superficie estándar del sistema de diseño. En tema oscuro se apoya en borde
// (las sombras apenas se perciben sobre fondos oscuros).
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-border bg-surface shadow-card dark:shadow-none',
        className,
      )}
      {...props}
    />
  )
}
