import { Coffee, Sailboat, Sunset, Waves } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Gallery } from '@/components/shared/gallery'
import { SectionHeading } from '@/components/shared/section-heading'
import { Seo } from '@/components/shared/seo'
import { SmartImage } from '@/components/shared/smart-image'
import { CtaBand } from '@/features/home/cta-band'
import { HOTEL, ROUTES } from '@/lib/constants'
import { breadcrumbJsonLd } from '@/lib/seo'

const HOTEL_GALLERY = [
  { src: '/images/hotel/fachada.jpg', alt: 'Fachada minimalista del hotel entre palmeras al atardecer' },
  { src: '/images/hotel/terraza.jpg', alt: 'Terraza principal con hamacas frente al lago' },
  { src: '/images/hotel/piscina.jpg', alt: 'Piscina exterior rodeada de vegetación tropical' },
  { src: '/images/hotel/spa.jpg', alt: 'Sala de spa con masajes y aromaterapia' },
  { src: '/images/hotel/restaurante.jpg', alt: 'Restaurante abierto con mesas frente al agua' },
  { src: '/images/hotel/muelle-atardecer.jpg', alt: 'Muelle privado del hotel al atardecer' },
]

const DAY_MOMENTS = [
  {
    icon: Waves,
    title: '7:00 a.m. — Kayak entre la bruma',
    text: 'El lago amanece en calma. Sales en kayak con un guía local y vuelves justo para el desayuno.',
  },
  {
    icon: Coffee,
    title: '9:30 a.m. — Desayuno sin prisa',
    text: 'Fruta tropical, arepas y café de la región servidos en la terraza, con el agua de fondo.',
  },
  {
    icon: Sailboat,
    title: '3:00 p.m. — Tarde de agua',
    text: 'Piscina, hamacas y paseos en lancha por las orillas y palafitos cercanos.',
  },
  {
    icon: Sunset,
    title: '6:30 p.m. — Atardecer en el muelle',
    text: 'La tradición del hotel: cocteles de la casa en el muelle mientras cae el sol.',
  },
]

export function AboutPage() {
  return (
    <>
      <Seo
        title="El hotel"
        description="Historia, espacios y filosofía del Hotel Brisas del Lago: un hotel boutique minimalista de seis habitaciones a orillas del Lago de Maracaibo."
        path={ROUTES.about}
        jsonLd={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'El hotel', path: ROUTES.about },
        ])}
      />

      <div className="pb-16 pt-28 md:pt-32">
        <Container wide>
          <SectionHeading
            as="h1"
            eyebrow="El hotel"
            title="Seis habitaciones, un solo horizonte"
            description="Brisas del Lago nació en 2019 con una idea simple: que el lago fuera el protagonista de toda la experiencia, no solo el paisaje de la foto."
          />

          <div className="mt-10 relative overflow-hidden rounded-media">
            <SmartImage
              src="/images/hotel/fachada.jpg"
              alt="Vista amplia de la fachada del Hotel Brisas del Lago con palmeras y el lago al fondo"
              ratio="aspect-[21/9]"
              eager
            />
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div className="prose-bdl space-y-5">
              <p>
                El hotel ocupa una casa de la costa norte de Maracaibo, renovada con líneas
                limpias, madera clara y ventanales que se abren al agua. Cada una de las seis
                habitaciones tiene una vista distinta; ninguna repite la anterior.
              </p>
              <p>
                Nos gusta decir que aquí el lujo es el tiempo: desayunar largo, leer en el muelle,
                ver cómo el sol cae sobre el lago. El equipo de {HOTEL.name} es pequeño a propósito
                para poder tratar a cada huésped como en casa.
              </p>
              <p>
                Trabajamos con proveedores locales —pescadores, panaderas y guías del barrio— y
                mantenemos una política de reserva directa: sin intermediarios, sin comisiones
                ocultas y con precios claros en dólares.
              </p>
            </div>

            <aside className="rounded-media border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-brand">El hotel en breve</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Habitaciones</dt>
                  <dd className="font-medium text-ink">6</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Abierto desde</dt>
                  <dd className="font-medium text-ink">2019</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Ubicación</dt>
                  <dd className="text-right font-medium text-ink">Costa norte, Maracaibo</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Desayuno</dt>
                  <dd className="font-medium text-ink">Incluido</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Calificación</dt>
                  <dd className="font-medium text-ink">{HOTEL.rating} / 5</dd>
                </div>
              </dl>
            </aside>
          </div>

          <section className="mt-16" aria-labelledby="galeria-hotel">
            <SectionHeading eyebrow="Galería" title="Los espacios" />
            <div className="mt-6">
              <Gallery images={HOTEL_GALLERY} />
            </div>
          </section>

          <section className="mt-16" aria-labelledby="un-dia">
            <SectionHeading
              eyebrow="Rutina"
              title="Un día en Brisas del Lago"
              description="Así se reparten las horas cuando el plan es no tener plan."
            />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {DAY_MOMENTS.map((moment) => (
                <li key={moment.title} className="rounded-card border border-border bg-surface p-5">
                  <moment.icon className="size-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-base font-semibold text-brand">
                    {moment.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{moment.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </div>

      <CtaBand />
    </>
  )
}
