import { Sailboat, Sunset, UtensilsCrossed, Waves, type LucideIcon } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { SmartImage } from '@/components/shared/smart-image'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { experiences, type Experience } from '@/data/experiences'

// Mapa de iconos: las claves viven en los datos (data/experiences.ts) para
// mantener el contenido editable sin tocar JSX.
const EXPERIENCE_ICONS: Record<Experience['icon'], LucideIcon> = {
  kayak: Waves,
  sunset: Sunset,
  boat: Sailboat,
  food: UtensilsCrossed,
}

export function Experiences() {
  return (
    <section className="py-16 md:py-24">
      <Container wide>
        <SectionHeading
          eyebrow="Experiencias"
          title="El lago, todo el día"
          description="Actividades curadas por el equipo del hotel para que la estadía se sienta propia."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((experience) => {
            const Icon = EXPERIENCE_ICONS[experience.icon]
            return (
              <li key={experience.id}>
                <Card className="group flex h-full flex-col overflow-hidden">
                  <SmartImage
                    src={experience.image.src}
                    alt={experience.image.alt}
                    ratio="aspect-[4/3]"
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-accent" aria-hidden="true" />
                      <h3 className="font-display text-lg font-semibold text-brand">
                        {experience.title}
                      </h3>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-muted">
                      {experience.description}
                    </p>
                    <Badge tone="accent" className="self-start">
                      {experience.priceNote}
                    </Badge>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
