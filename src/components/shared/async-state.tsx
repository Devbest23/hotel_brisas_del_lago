import { CircleAlert, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

// ============================================================================
// Manejo homogéneo de estados de componentes dinámicos:
// carga (skeleton) · error (con reintento) · vacío (con acción sugerida) · éxito.
// Requisito del proyecto: ningún componente dinámico se queda "en blanco".
// ============================================================================

interface AsyncStateProps {
  status: 'loading' | 'error' | 'empty' | 'success'
  /** Contenido del estado (por defecto: grilla de skeletons definida por quien usa). */
  loading?: ReactNode
  error?: ReactNode
  empty?: ReactNode
  children: ReactNode
  className?: string
}

export function AsyncState({ status, loading, error, empty, children, className }: AsyncStateProps) {
  if (status === 'loading') {
    return (
      <div role="status" aria-label="Cargando contenido" className={className}>
        {loading}
      </div>
    )
  }

  if (status === 'error') return <div className={className}>{error}</div>
  if (status === 'empty') return <div className={className}>{empty}</div>

  return <>{children}</>
}

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'No pudimos cargar esta sección',
  description = 'Revisa tu conexión e inténtalo de nuevo.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-4 rounded-media border border-danger/30 bg-danger-bg p-8 text-center ${className ?? ''}`}
    >
      <CircleAlert className="size-8 text-danger" aria-hidden="true" />
      <div>
        <p className="font-medium text-danger">{title}</p>
        <p className="mt-1 text-sm text-danger opacity-90">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-media border border-border bg-surface-2 p-8 text-center ${className ?? ''}`}
    >
      <Inbox className="size-8 text-muted" aria-hidden="true" />
      <div>
        <p className="font-medium text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
