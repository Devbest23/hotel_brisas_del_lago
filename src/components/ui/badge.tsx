import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

// Etiqueta compacta de estado. Siempre acompaña a texto/icono: nunca comunica
// información solo con color (WCAG 1.4.1 Uso del color).

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  info: 'bg-info-bg text-info',
  accent: 'bg-accent/10 text-accent',
}

interface BadgeProps {
  tone?: Tone
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
