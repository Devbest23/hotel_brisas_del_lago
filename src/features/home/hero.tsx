import { Rating } from '@/components/ui/rating'
import { Container } from '@/components/layout/container'
import { SmartImage } from '@/components/shared/smart-image'
import { StaySearchForm } from '@/features/booking/stay-search-form'
import { HOTEL } from '@/lib/constants'

// Hero de la landing: fotografía del lago + propuesta de valor + buscador.
// La navbar es transparente sobre esta sección (ver navbar.tsx).
export function Hero() {
  return (
    <section className="relative min-h-[88vh]">
      {/* Fotografía de fondo con velo que garantiza el contraste del texto */}
      <div className="absolute inset-0 -z-10">
        <SmartImage
          src="/images/hero-lago.jpg"
          alt="Amanecer sobre el Lago de Maracaibo visto desde el hotel, con montañas al fondo"
          eager
          className="h-full w-full object-cover"
        />
        <div className="scrim-photo absolute inset-0" aria-hidden="true" />
      </div>

      <Container className="flex min-h-[88vh] flex-col justify-end pb-12 pt-28 md:pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-band-on/85">
          Hotel boutique · Maracaibo, Venezuela
        </p>

        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.08] text-band-on md:text-6xl">
          Descansa frente al Lago de Maracaibo
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-band-on/90 md:text-lg">
          Habitaciones minimalistas, desayuno incluido y el mejor atardecer de la costa. Reserva
          directo, sin intermediarios.
        </p>

        {/* Buscador de disponibilidad */}
        <div className="mt-8 rounded-media border border-border bg-surface/95 p-4 shadow-raised backdrop-blur md:p-5 dark:shadow-none">
          <StaySearchForm />
        </div>

        {/* Franja de confianza */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-band-on/90">
          <Rating value={HOTEL.rating} count={HOTEL.reviewCount} tone="onBand" />
          <span aria-hidden="true" className="hidden h-4 w-px bg-band-on/30 md:block" />
          <span>+300 huéspedes al año</span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-band-on/30 md:block" />
          <span>Confirmación por WhatsApp en horario hábil</span>
        </div>
      </Container>
    </section>
  )
}
