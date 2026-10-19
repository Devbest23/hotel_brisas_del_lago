import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

import { BookingSummary } from './booking-summary'
import { useBooking, type BookingStep } from './booking-context'
import { StepDates } from './step-dates'
import { StepGuest } from './step-guest'
import { StepReview } from './step-review'
import { StepRoom } from './step-room'

// Orquestador del asistente: progreso + paso actual + resumen lateral.
// El paso activo vive en el contexto (persistido por sesión).

const STEPS: Array<{ step: BookingStep; label: string }> = [
  { step: 1, label: 'Fechas' },
  { step: 2, label: 'Habitación' },
  { step: 3, label: 'Tus datos' },
  { step: 4, label: 'Revisar y enviar' },
]

export function BookingWizard() {
  const { draft } = useBooking()

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Pasos de la reserva">
          {STEPS.map(({ step, label }, index) => {
            const state = step < draft.step ? 'done' : step === draft.step ? 'current' : 'todo'

            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-xs font-semibold',
                    state === 'done' && 'bg-success-bg text-success',
                    state === 'current' && 'bg-brand text-brand-on',
                    state === 'todo' && 'bg-surface-2 text-muted',
                  )}
                >
                  {state === 'done' ? <Check className="size-4" /> : step}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    state === 'current' ? 'font-medium text-ink' : 'text-muted',
                  )}
                >
                  {label}
                </span>
                {index < STEPS.length - 1 && (
                  <span aria-hidden="true" className="mx-1 hidden h-px w-6 bg-border md:block" />
                )}
              </li>
            )
          })}
        </ol>

        {/* Anuncio del cambio de paso para lectores de pantalla */}
        <p className="sr-only" aria-live="polite">
          Paso {draft.step} de 4: {STEPS[draft.step - 1].label}
        </p>

        <div key={draft.step} className="step-anim mt-8">
          {draft.step === 1 && <StepDates />}
          {draft.step === 2 && <StepRoom />}
          {draft.step === 3 && <StepGuest />}
          {draft.step === 4 && <StepReview />}
        </div>
      </div>

      <BookingSummary className="lg:sticky lg:top-24" />
    </div>
  )
}
