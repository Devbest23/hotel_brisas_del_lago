import { cn } from '@/lib/utils'

// Encabezado de sección reutilizable: antetítulo + título + descripción.
// `as` mantiene la jerarquía semántica correcta (un solo h1 por página).

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl space-y-3',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">{eyebrow}</p>
      )}
      <Tag
        className={cn(
          'font-display font-semibold text-brand',
          Tag === 'h1' ? 'text-4xl leading-[1.1] md:text-6xl' : 'text-3xl leading-tight md:text-4xl',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className="text-base leading-relaxed text-muted md:text-lg">{description}</p>
      )}
    </div>
  )
}
