import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { MapEmbed } from '@/components/shared/map-embed'
import { SectionHeading } from '@/components/shared/section-heading'
import { Seo } from '@/components/shared/seo'
import { Card } from '@/components/ui/card'
import { ContactForm } from '@/features/contact/contact-form'
import { CONTACT_EMAIL, HOTEL, ROUTES, WHATSAPP_NUMBER } from '@/lib/constants'
import { breadcrumbJsonLd } from '@/lib/seo'

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contacto"
        description="Escríbenos por WhatsApp o correo para consultar disponibilidad, organizar eventos o resolver cualquier duda sobre tu estadía en Brisas del Lago."
        path={ROUTES.contact}
        jsonLd={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Contacto', path: ROUTES.contact },
        ])}
      />

      <div className="pb-16 pt-28 md:pt-32">
        <Container wide>
          <SectionHeading
            as="h1"
            eyebrow="Contacto"
            title="Hablemos de tu estadía"
            description="Respondemos en horario hábil (8 a.m.–8 p.m.). Para consultas urgentes, WhatsApp es el camino más rápido."
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="font-display text-xl font-semibold text-brand">
                  Canales directos
                </h2>
                <ul className="mt-4 space-y-4 text-sm">
                  <li>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-3 text-ink transition-colors hover:text-link"
                    >
                      <MessageCircle className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                      <span>
                        <span className="block font-medium">WhatsApp</span>
                        <span className="text-muted">{HOTEL.phone} · respuesta más rápida</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="flex items-start gap-3 text-ink transition-colors hover:text-link"
                    >
                      <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                      <span>
                        <span className="block font-medium">Correo electrónico</span>
                        <span className="text-muted">{CONTACT_EMAIL}</span>
                      </span>
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>
                      <span className="block font-medium text-ink">Dirección</span>
                      <span className="text-muted">{HOTEL.address}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>
                      <span className="block font-medium text-ink">Horarios</span>
                      <span className="text-muted">
                        Recepción 24 h · Check-in {HOTEL.checkIn} · Check-out {HOTEL.checkOut}
                      </span>
                    </span>
                  </li>
                </ul>
              </Card>

              <MapEmbed className="h-80" />
            </div>

            <Card className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold text-brand">Envíanos un mensaje</h2>
              <p className="mt-1 text-sm text-muted">
                Completa el formulario y te respondemos por correo o WhatsApp.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Card>
          </div>
        </Container>
      </div>
    </>
  )
}
