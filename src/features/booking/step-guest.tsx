import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, fieldA11y } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { applyZodErrors } from '@/lib/form'
import { guestFieldsSchema } from '@/lib/schemas'

import { useBooking } from './booking-context'

// Paso 3 — Datos de la persona que reserva.
// Formulario con react-hook-form y validación con Zod (misma fuente de verdad).

interface GuestFormValues {
  fullName: string
  email: string
  phone: string
  country: string
  notes: string
}

export function StepGuest() {
  const { draft, patch, goToStep } = useBooking()
  const prefix = useId()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<GuestFormValues>({
    defaultValues: {
      fullName: draft.fullName,
      email: draft.email,
      phone: draft.phone,
      country: draft.country,
      notes: draft.notes,
    },
  })

  const onSubmit = handleSubmit((values) => {
    const valid = applyZodErrors(
      guestFieldsSchema,
      { ...values, website: '' },
      setError,
    )

    if (!valid) return

    patch({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      country: values.country.trim(),
      notes: values.notes?.trim() ?? '',
    })
    goToStep(4)
  })

  return (
    <section aria-labelledby="paso-datos">
      <h2 id="paso-datos" className="font-display text-2xl font-semibold text-brand">
        Tus datos
      </h2>
      <p className="mt-1 text-sm text-muted">
        Solo los usamos para confirmar tu reserva. Nunca compartimos tu información.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Nombre y apellido"
          htmlFor={`${prefix}-fullName`}
          error={errors.fullName?.message}
          className="sm:col-span-2"
          required
        >
          <Input
            id={`${prefix}-fullName`}
            autoComplete="name"
            placeholder="María Fernanda Rodríguez"
            {...register('fullName')}
            {...fieldA11y(`${prefix}-fullName`, errors.fullName?.message)}
          />
        </Field>

        <Field
          label="Correo electrónico"
          htmlFor={`${prefix}-email`}
          error={errors.email?.message}
          required
        >
          <Input
            id={`${prefix}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            {...register('email')}
            {...fieldA11y(`${prefix}-email`, errors.email?.message)}
          />
        </Field>

        <Field
          label="Teléfono / WhatsApp"
          htmlFor={`${prefix}-phone`}
          error={errors.phone?.message}
          hint="Con código de país, ej. +58 414 123 4567"
          required
        >
          <Input
            id={`${prefix}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+58 414 123 4567"
            {...register('phone')}
            {...fieldA11y(`${prefix}-phone`, errors.phone?.message)}
          />
        </Field>

        <Field
          label="País"
          htmlFor={`${prefix}-country`}
          error={errors.country?.message}
          className="sm:col-span-2"
          required
        >
          <Input
            id={`${prefix}-country`}
            autoComplete="country-name"
            placeholder="Venezuela"
            {...register('country')}
            {...fieldA11y(`${prefix}-country`, errors.country?.message)}
          />
        </Field>

        <Field
          label="Notas para el hotel (opcional)"
          htmlFor={`${prefix}-notes`}
          error={errors.notes?.message}
          hint="Alergias, hora de llegada aproximada, ocasión especial…"
          className="sm:col-span-2"
        >
          <Textarea
            id={`${prefix}-notes`}
            placeholder="Llegamos alrededor de las 6 p.m. y celebramos un aniversario."
            {...register('notes')}
            {...fieldA11y(`${prefix}-notes`, errors.notes?.message)}
          />
        </Field>

        <div className="flex justify-between sm:col-span-2">
          <Button type="button" variant="ghost" onClick={() => goToStep(2)}>
            Atrás
          </Button>
          <Button type="submit">Continuar a revisión</Button>
        </div>
      </form>
    </section>
  )
}
