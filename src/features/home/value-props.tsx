import { UtensilsCrossed, Waves, Wifi } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Card } from '@/components/ui/card'

// Tres promesas del hotel. Contenido simple y editable (docs/contenido.md).
const VALUE_PROPS = [
  {
    icon: Waves,
    title: 'Frente al lago',
    text: 'Todas las áreas comunes miran al agua y las suites tienen balcón o terraza privada.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Desayuno incluido',
    text: 'Productos locales servidos en la terraza del restaurante, de 7:00 a 10:30 a.m.',
  },
  {
    icon: Wifi,
    title: 'WiFi y trabajo',
    text: '300 Mbps simétricos, escritorio en cada habitación y rincones tranquilos para concentrarse.',
  },
]

export function ValueProps() {
  return (
    <section className="py-16 md:py-20">
      <Container wide>
        <ul className="grid gap-5 md:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <li key={item.title}>
              <Card className="h-full p-6">
                <item.icon className="size-6 text-accent" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-semibold text-brand">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
