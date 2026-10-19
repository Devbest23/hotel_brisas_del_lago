import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { SiteLayout } from '@/components/layout/layout'
import { RouteError } from '@/components/shared/route-error'
import { Loader2 } from 'lucide-react'

import { HomePage } from '@/pages/home'

// ============================================================================
// Router de la aplicación.
//
// WHY code splitting: solo la landing viaja en el bundle inicial (velocidad de
// primera visita); el catálogo, el asistente de reserva, el calendario y las
// páginas secundarias se descargan la primera vez que se navega a ellas.
//
// WHY basename: en GitHub Pages el sitio vive en /nombre-del-repo/; BASE_URL lo
// resuelve automáticamente tanto en local ('/') como en producción ('/repo/').
// El workflow copia index.html → 404.html para que los enlaces profundos
// (ej. /habitaciones/suite-brisa) funcionen al recargar.
// ============================================================================

const RoomsPage = lazy(() => import('@/pages/rooms').then((m) => ({ default: m.RoomsPage })))
const RoomDetailPage = lazy(() =>
  import('@/pages/room-detail').then((m) => ({ default: m.RoomDetailPage })),
)
const BookingPage = lazy(() => import('@/pages/booking').then((m) => ({ default: m.BookingPage })))
const RequestSentPage = lazy(() =>
  import('@/pages/request-sent').then((m) => ({ default: m.RequestSentPage })),
)
const AboutPage = lazy(() => import('@/pages/about').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('@/pages/contact').then((m) => ({ default: m.ContactPage })))
const LegalPage = lazy(() => import('@/pages/legal').then((m) => ({ default: m.LegalPage })))
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })),
)

/** Pantalla de espera mientras se descarga el chunk de una ruta. */
function ChunkFallback() {
  return (
    <div
      role="status"
      aria-label="Cargando página"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted"
    >
      <Loader2 className="size-6 animate-spin" aria-hidden="true" />
      <p className="text-sm">Cargando…</p>
    </div>
  )
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<ChunkFallback />}>{element}</Suspense>
}

const router = createBrowserRouter(
  [
    {
      element: <SiteLayout />,
      errorElement: <RouteError />,
      children: [
        { index: true, path: '/', element: <HomePage /> },
        { path: 'habitaciones', element: withSuspense(<RoomsPage />) },
        { path: 'habitaciones/:slug', element: withSuspense(<RoomDetailPage />) },
        { path: 'reservar', element: withSuspense(<BookingPage />) },
        { path: 'reservar/solicitud-enviada', element: withSuspense(<RequestSentPage />) },
        { path: 'el-hotel', element: withSuspense(<AboutPage />) },
        { path: 'contacto', element: withSuspense(<ContactPage />) },
        { path: 'privacidad', element: withSuspense(<LegalPage document="privacy" />) },
        { path: 'terminos', element: withSuspense(<LegalPage document="terms" />) },
        { path: '*', element: withSuspense(<NotFoundPage />) },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)

export function AppRouter() {
  return <RouterProvider router={router} />
}
