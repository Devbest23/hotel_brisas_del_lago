import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

// Banda de conversión final con la paleta de marca (texto claro = 6.5:1, AA).
export function CtaBand() {
  return (
    <section className="bg-band text-band-on">
      <Container className="flex flex-col items-center gap-6 py-16 text-center md:py-20">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">¿Listo para desconectar?</h2>
        <p className="max-w-xl text-band-on/90">
          Reserva directo con nosotros: sin comisiones de intermediarios y con confirmación por
          WhatsApp en horario hábil.
        </p>
        <Button asChild size="lg" className="border border-band-on/40 bg-band-on text-band hover:bg-band-on/90">
          <Link to={ROUTES.booking}>Reservar ahora</Link>
        </Button>
      </Container>
    </section>
  )
}
