import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/shared/section-heading'
import { Seo } from '@/components/shared/seo'
import { CONTACT_EMAIL, HOTEL, ROUTES } from '@/lib/constants'

// ============================================================================
// Páginas legales (plantillas de demostración).
// Contenido de ejemplo realista para el proyecto universitario; antes de un
// uso comercial, reemplazar por textos revisados por asesoría legal.
// ============================================================================

interface LegalSection {
  heading: string
  paragraphs: string[]
}

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Qué datos recopilamos',
    paragraphs: [
      'Cuando envías una solicitud de reserva o un mensaje de contacto, recopilamos únicamente los datos necesarios para atenderte: nombre, correo electrónico, teléfono, país, fechas de estadía y las notas que decidas incluir.',
      'No solicitamos ni almacenamos datos de tarjetas bancarias: los pagos se acuerdan directamente con el hotel (efectivo, transferencia, pago móvil o Zelle).',
    ],
  },
  {
    heading: 'Dónde viajan tus datos',
    paragraphs: [
      'Este sitio es 100% estático: no tiene base de datos propia. Al enviar la solicitud, la información viaja por el canal que elijas (WhatsApp, un formulario de Formspree o tu aplicación de correo) y llega directamente al equipo del hotel.',
      'El borrador del asistente de reserva se guarda solo en tu navegador (sessionStorage) para que no pierdas lo escrito si recargas la página; se elimina al cerrar la pestaña.',
    ],
  },
  {
    heading: 'Cookies y almacenamiento local',
    paragraphs: [
      'No usamos cookies de rastreo ni publicidad. Solo guardamos en tu navegador tu preferencia de tema claro/oscuro (localStorage) y el borrador de la reserva (sessionStorage).',
    ],
  },
  {
    heading: 'Servicios de terceros',
    paragraphs: [
      'El mapa interactivo se carga desde OpenStreetMap y solo cuando tú lo pides con un clic. Si configuras el hotel para recibir solicitudes por Formspree, el formulario usa su servicio de envío de correo.',
      'Las fotografías de demostración provienen de Unsplash, bajo su licencia libre.',
    ],
  },
  {
    heading: 'Tus derechos',
    paragraphs: [
      `Puedes solicitar en cualquier momento la eliminación de los datos de tu solicitud escribiendo a ${CONTACT_EMAIL}. Al no existir una base de datos del sitio, el hotel gestionará la solicitud sobre el canal por el que la enviaste.`,
    ],
  },
]

const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Naturaleza de la solicitud',
    paragraphs: [
      `A través de ${HOTEL.fullName} puedes enviar una SOLICITUD de reserva. La solicitud no es una reserva confirmada ni genera cargos automáticos: el hotel verifica disponibilidad y responde con la confirmación, la tarifa final y las instrucciones de pago.`,
    ],
  },
  {
    heading: 'Precios y pagos',
    paragraphs: [
      'Los precios se muestran en dólares estadounidenses (USD), por noche y con desayuno incluido, y son referenciales hasta la confirmación del hotel. No se procesan pagos en línea desde este sitio.',
      'El pago se acuerda directamente con el hotel al confirmar la reserva o al llegar (efectivo USD, transferencia, pago móvil o Zelle, según disponibilidad).',
    ],
  },
  {
    heading: 'Cancelaciones',
    paragraphs: [
      'Puedes cancelar sin penalidad hasta 48 horas antes de la fecha de llegada, escribiendo al hotel por WhatsApp o correo. Pasado ese plazo, el hotel puede aplicar condiciones especiales según la temporada.',
    ],
  },
  {
    heading: 'Check-in, check-out y normas',
    paragraphs: [
      `Check-in a partir de las ${HOTEL.checkIn} y check-out hasta las ${HOTEL.checkOut}. No se permite fumar en las habitaciones ni en áreas cerradas. Se pide silencio nocturno de 10:00 p.m. a 7:00 a.m.`,
      'Las mascotas pequeñas (hasta 10 kg) se admiten con consulta previa. Los menores de 6 años se alojan gratis compartiendo con sus padres.',
    ],
  },
  {
    heading: 'Disponibilidad referencial',
    paragraphs: [
      'La disponibilidad mostrada en el sitio es una simulación de demostración: la información válida es siempre la que confirme el equipo del hotel por sus canales oficiales.',
    ],
  },
  {
    heading: 'Legislación aplicable',
    paragraphs: [
      'Estos términos se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier controversia se atenderá, en primera instancia, mediante comunicación directa con el hotel.',
    ],
  },
]

interface LegalPageProps {
  document: 'privacy' | 'terms'
}

export function LegalPage({ document }: LegalPageProps) {
  const isPrivacy = document === 'privacy'
  const title = isPrivacy ? 'Política de privacidad' : 'Términos y condiciones'
  const description = isPrivacy
    ? 'Cómo trata Brisas del Lago los datos que compartes al enviar una solicitud de reserva.'
    : 'Condiciones de las solicitudes de reserva, precios, cancelaciones y normas del hotel.'
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={isPrivacy ? ROUTES.privacy : ROUTES.terms}
      />

      <div className="pb-16 pt-28 md:pt-32">
        <Container>
          <SectionHeading
            as="h1"
            title={title}
            description="Última actualización: marzo de 2026."
          />

          <div className="mt-10 max-w-3xl space-y-8">
            {sections.map((section) => (
              <section key={section.heading} className="space-y-2.5">
                <h2 className="font-display text-xl font-semibold text-brand">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="mt-12 max-w-3xl rounded-card border border-border bg-surface-2 p-4 text-xs leading-relaxed text-muted">
            Documento de ejemplo creado para un proyecto académico. Antes de publicar el sitio
            para el hotel real, revisa estos textos con asesoría legal.
          </p>
        </Container>
      </div>
    </>
  )
}
