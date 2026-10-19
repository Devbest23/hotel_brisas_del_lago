import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/container'
import { CONTACT_EMAIL, HOTEL, ROUTES, WHATSAPP_NUMBER } from '@/lib/constants'

const exploreLinks = [
  { to: ROUTES.home, label: 'Inicio' },
  { to: ROUTES.rooms, label: 'Habitaciones' },
  { to: ROUTES.about, label: 'El hotel' },
  { to: ROUTES.booking, label: 'Reservar' },
  { to: ROUTES.contact, label: 'Contacto' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface-2">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-display text-xl font-semibold text-brand">Brisas del Lago</p>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{HOTEL.tagline}.</p>
          <div className="flex gap-2">
            <a
              href="#instagram"
              aria-label="Instagram del hotel (próximamente)"
              className="rounded-full border border-border p-2 text-muted transition-colors hover:text-link"
            >
              <Instagram className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#facebook"
              aria-label="Facebook del hotel (próximamente)"
              className="rounded-full border border-border p-2 text-muted transition-colors hover:text-link"
            >
              <Facebook className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav aria-label="Enlaces del sitio">
          <h2 className="text-sm font-semibold text-ink">Explorar</h2>
          <ul className="mt-4 space-y-2.5">
            {exploreLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted transition-colors hover:text-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-ink">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-link"
              >
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                {HOTEL.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 transition-colors hover:text-link"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{HOTEL.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Check-in {HOTEL.checkIn} · Check-out {HOTEL.checkOut}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">Legal</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to={ROUTES.privacy} className="text-sm text-muted transition-colors hover:text-link">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link to={ROUTES.terms} className="text-sm text-muted transition-colors hover:text-link">
                Términos y condiciones
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted md:flex-row">
          <p>
            © {year} {HOTEL.fullName}. Todos los derechos reservados.
          </p>
          <p>Fotografías de muestra: Unsplash · Sitio demostrativo</p>
        </Container>
      </div>
    </footer>
  )
}
