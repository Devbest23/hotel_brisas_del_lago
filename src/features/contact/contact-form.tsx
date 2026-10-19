import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, fieldA11y } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { FORMSPREE_ID } from '@/lib/constants'
import { applyZodErrors } from '@/lib/form'
import { contactSchema, type ContactInput } from '@/lib/schemas'
import { submitContactMessage } from '@/lib/submit'

// Formulario de contacto.
// Con Formspree configurado envía directo; si no, abre la app de correo con
// todo prellenado (el sitio no tiene backend — decisión documentada).

interface ContactFormValues {
  name: string
  email: string
  subject: ContactInput['subject']
  message: string
}

const SUBJECT_OPTIONS: Array<{ value: ContactFormValues['subject']; label: string }> = [
  { value: 'reserva', label: 'Consulta sobre una reserva' },
  { value: 'eventos', label: 'Eventos y celebraciones' },
  { value: 'prensa', label: 'Prensa y alianzas' },
  { value: 'otro', label: 'Otro tema' },
]

export function ContactForm() {
  const prefix = useId()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: { name: '', email: '', subject: 'reserva', message: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    const valid = applyZodErrors(contactSchema, { ...values, website: '' }, setError)
    if (!valid) return

    try {
      await submitContactMessage({ ...values, website: '' })
      toast({
        tone: 'success',
        title: 'Mensaje listo para enviar',
        description: FORMSPREE_ID
          ? 'Te responderemos muy pronto al correo indicado.'
          : 'Revisa tu aplicación de correo para completar el envío.',
      })
      reset()
    } catch (error) {
      toast({
        tone: 'error',
        title: 'No se pudo enviar tu mensaje',
        description: error instanceof Error ? error.message : 'Intenta de nuevo en un momento.',
      })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre" htmlFor={`${prefix}-name`} error={errors.name?.message} required>
        <Input
          id={`${prefix}-name`}
          autoComplete="name"
          placeholder="Tu nombre"
          {...register('name')}
          {...fieldA11y(`${prefix}-name`, errors.name?.message)}
        />
      </Field>

      <Field label="Correo electrónico" htmlFor={`${prefix}-email`} error={errors.email?.message} required>
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
        label="Asunto"
        htmlFor={`${prefix}-subject`}
        error={errors.subject?.message}
        className="sm:col-span-2"
        required
      >
        <Select id={`${prefix}-subject`} {...register('subject')}>
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Mensaje"
        htmlFor={`${prefix}-message`}
        error={errors.message?.message}
        hint="Cuéntanos fechas aproximadas o tu consulta con detalle."
        className="sm:col-span-2"
        required
      >
        <Textarea
          id={`${prefix}-message`}
          placeholder="Hola, quisiera consultar disponibilidad para…"
          {...register('message')}
          {...fieldA11y(`${prefix}-message`, errors.message?.message)}
        />
      </Field>

      <div className="space-y-2 sm:col-span-2">
        <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
          Enviar mensaje
        </Button>
        <p className="text-xs text-muted">
          {FORMSPREE_ID
            ? 'Tu mensaje se envía directamente desde este sitio.'
            : 'Al enviar se abrirá tu aplicación de correo con el mensaje listo.'}{' '}
          Nunca compartimos tus datos (ver política de privacidad).
        </p>
      </div>
    </form>
  )
}
