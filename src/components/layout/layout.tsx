import { ScrollRestoration, Outlet } from 'react-router-dom'

import { BackToTop } from '@/components/layout/back-to-top'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'

// Layout raíz: navbar fija + contenido + footer.
// ScrollRestoration restaura la posición de scroll al navegar atrás/adelante
// (comportamiento natural de navegador en una SPA).
export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Primer elemento tabulable de la página: salta directo al contenido */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-brand-on"
      >
        Saltar al contenido
      </a>

      <Navbar />

      <main id="contenido" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <BackToTop />
      <ScrollRestoration />
    </div>
  )
}
