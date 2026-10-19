import { CheckCircle2, CircleAlert, Info, X, type LucideIcon } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

// ============================================================================
// Sistema de avisos (toasts) propio, sin dependencias externas.
// Accesible: contenedor aria-live="polite", se pausa al pasar el mouse y
// cada aviso se cierra con un botón con nombre accesible.
// ============================================================================

type ToastTone = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  tone: ToastTone
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return context
}

const TONE_ICON: Record<ToastTone, LucideIcon> = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
}

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'border-success/30 bg-success-bg text-success',
  error: 'border-danger/30 bg-danger-bg text-danger',
  info: 'border-info/30 bg-info-bg text-info',
}

const AUTO_DISMISS_MS = 5_000
const MAX_VISIBLE = 3

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)
  const timersRef = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((item) => item.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const startTimer = useCallback(
    (id: number) => {
      timersRef.current.set(
        id,
        window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      )
    },
    [dismiss],
  )

  const toast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = ++counterRef.current
      // WHY: se limitan los visibles a 3 y se auto-descarta el más antiguo.
      setToasts((list) => {
        const next = [...list, { ...item, id }]
        return next.slice(-MAX_VISIBLE)
      })
      startTimer(id)
    },
    [startTimer],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((item) => {
          const Icon = TONE_ICON[item.tone]
          return (
            <div
              key={item.id}
              role="status"
              onMouseEnter={() => {
                const timer = timersRef.current.get(item.id)
                if (timer) {
                  window.clearTimeout(timer)
                  timersRef.current.delete(item.id)
                }
              }}
              onMouseLeave={() => startTimer(item.id)}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border p-4 shadow-raised dark:shadow-none',
                TONE_CLASSES[item.tone],
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div className="flex-1 text-sm">
                <p className="font-medium">{item.title}</p>
                {item.description && <p className="mt-0.5 opacity-90">{item.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Cerrar aviso"
                className="cursor-pointer rounded-full p-1 hover:opacity-70"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
