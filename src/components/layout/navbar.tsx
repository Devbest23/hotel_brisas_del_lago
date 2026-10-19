import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: ROUTES.home, label: 'Inicio' },
  { to: ROUTES.rooms, label: 'Habitaciones' },
  { to: ROUTES.about, label: 'El hotel' },
  { to: ROUTES.contact, label: 'Contacto' },
] as const

// Barra de navegación fija.
// WHY: sobre el hero del inicio es transparente con texto claro (hay un velo
// oscuro sobre la foto que garantiza el contraste); al hacer scroll o al salir
// del inicio pasa a superficie sólida para máxima legibilidad.
export function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'
  const solid = !isHome || scrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        solid ? 'border-b border-border bg-surface/95 backdrop-blur' : 'bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to={ROUTES.home}
          className={cn(
            'font-display text-xl font-semibold tracking-tight',
            solid ? 'text-brand' : 'text-band-on',
          )}
        >
          Brisas del Lago
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === ROUTES.home}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                      solid
                        ? 'text-ink hover:bg-surface-2'
                        : 'text-band-on/90 hover:bg-white/10 hover:text-band-on',
                      isActive && 'underline decoration-2 underline-offset-8',
                      isActive && (solid ? 'decoration-link' : 'decoration-band-on'),
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle
            className={cn(!solid && 'text-band-on hover:bg-white/10 hover:text-band-on')}
          />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to={ROUTES.booking}>Reservar</Link>
          </Button>

          {/* Menú móvil (panel lateral accesible sobre Radix Dialog) */}
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú de navegación"
                className={cn('md:hidden', !solid && 'text-band-on hover:bg-white/10 hover:text-band-on')}
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </DialogTrigger>

            <DialogContent variant="sheet">
              <DialogTitle className="font-display text-lg font-semibold text-brand">
                Brisas del Lago
              </DialogTitle>

              <nav aria-label="Navegación móvil" className="mt-6 flex-1">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.to === ROUTES.home}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'block rounded-control px-3 py-2.5 text-base font-medium',
                            isActive ? 'bg-surface-2 text-brand' : 'text-ink hover:bg-surface-2',
                          )
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-6 space-y-3 border-t border-border pt-4">
                <Button asChild className="w-full">
                  <Link to={ROUTES.booking} onClick={() => setMenuOpen(false)}>
                    Reservar ahora
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted">Confirmación por WhatsApp en horario hábil</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </header>
  )
}
