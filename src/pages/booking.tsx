import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { Seo } from '@/components/shared/seo'
import { BookingProvider } from '@/features/booking/booking-context'
import { BookingWizard } from '@/features/booking/booking-wizard'

// Página del asistente de reserva (4 pasos).
// El BookingProvider lee los parámetros de la URL (?checkIn&checkOut&guests&room)
// y restaura el borrador guardado en la sesión.
export function BookingPage() {
  return (
    <>
      <Seo
        title="Reservar"
        description="Solicita tu reserva en el Hotel Brisas del Lago: cuatro pasos, sin pagos en línea y con confirmación directa del hotel por WhatsApp o correo."
        path="/reservar"
      />

      <div className="pb-16 pt-28 md:pt-32">
        <Container wide>
          <SectionHeading
            as="h1"
            eyebrow="Reserva directa"
            title="Reserva tu estadía"
            description="Sin pagos en línea: el hotel confirma disponibilidad y tarifa antes de cualquier cargo."
          />

          <BookingProvider>
            <BookingWizard />
          </BookingProvider>
        </Container>
      </div>
    </>
  )
}
