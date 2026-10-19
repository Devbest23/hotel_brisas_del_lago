import { Seo } from '@/components/shared/seo'
import { faqItems } from '@/data/faq'
import { CtaBand } from '@/features/home/cta-band'
import { Experiences } from '@/features/home/experiences'
import { FaqSection } from '@/features/home/faq-section'
import { FeaturedRooms } from '@/features/home/featured-rooms'
import { Hero } from '@/features/home/hero'
import { Testimonials } from '@/features/home/testimonials'
import { ValueProps } from '@/features/home/value-props'
import { faqJsonLd, hotelJsonLd } from '@/lib/seo'

// Landing: hero con buscador + secciones de venta + FAQ + banda de conversión.
export function HomePage() {
  return (
    <>
      <Seo
        title="Hotel boutique frente al Lago de Maracaibo"
        description="Despierta frente al lago. Habitaciones minimalistas con vista al agua, desayuno incluido y reserva directa con confirmación del hotel."
        path="/"
        jsonLd={[hotelJsonLd(), faqJsonLd(faqItems)]}
      />

      <Hero />
      <ValueProps />
      <FeaturedRooms />
      <Experiences />
      <Testimonials />
      <FaqSection />
      <CtaBand />
    </>
  )
}
