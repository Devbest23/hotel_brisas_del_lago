import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card } from '@/components/ui/card'
import { Rating } from '@/components/ui/rating'
import { testimonials } from '@/data/testimonials'

// Testimonios.
// WHY sin librería de carrusel: en móvil es un scroll con snap nativo (gesto
// que la gente ya conoce) y en escritorio una grilla. Menos JS, mejor a11y.
export function Testimonials() {
  return (
    <section className="bg-surface-2 py-16 md:py-24">
      <Container wide>
        <SectionHeading
          eyebrow="Huéspedes"
          title="Lo que cuentan quienes ya vinieron"
          description="Reseñas de huéspedes reales de la temporada 2025–2026 (contenido de muestra)."
        />

        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} className="w-[84%] shrink-0 snap-start md:w-auto">
              <Card className="flex h-full flex-col gap-4 p-6">
                <Rating value={testimonial.rating} />
                <blockquote className="flex-1 text-sm leading-relaxed text-muted">
                  “{testimonial.quote}”
                </blockquote>
                <footer className="border-t border-border pt-3">
                  <p className="text-sm font-medium text-ink">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.origin}</p>
                </footer>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
