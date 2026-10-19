import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

// Botón base del sistema de diseño (estilo shadcn/ui con Radix Slot).
// Variantes pensadas para la paleta verificada WCAG: ver globals.css.

type Variant = 'primary' | 'secondary' | 'ghost' | 'link' | 'band'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-brand-on hover:opacity-90',
  secondary: 'border border-border-strong bg-transparent text-ink hover:bg-surface-2',
  ghost: 'text-ink hover:bg-surface-2',
  link: 'px-0 text-link underline-offset-4 hover:underline',
  band: 'bg-band text-band-on hover:opacity-90',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
  icon: 'size-11',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Renderiza el hijo como elemento (ej. <Link>) conservando los estilos. */
  asChild?: boolean
  /** Muestra spinner y bloquea el botón para evitar doble envío. */
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', asChild = false, loading = false, disabled, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-[color,background-color,opacity] duration-150',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={asChild ? undefined : loading || disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
})
