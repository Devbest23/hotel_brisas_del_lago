import { cn } from '@/lib/utils'

/** Bloque de carga (shimmer). aria-hidden: la espera se anuncia por role="status". */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-card bg-surface-2', className)} />
}
