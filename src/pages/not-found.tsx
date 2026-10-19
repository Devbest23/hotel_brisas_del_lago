import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Seo } from '@/components/shared/seo'
import { ROUTES } from '@/lib/constants'

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Página no encontrada"
        description="La página que buscas no existe o cambió de dirección."
        path="/404"
        noindex
      />

      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-5 px-4 py-24 text-center">
        <p className="font-display text-6xl font-semibold text-brand">404</p>
        <h1 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          No encontramos esta página
        </h1>
        <p className="max-w-md text-muted">
          Puede que el enlace haya cambiado o que la dirección tenga un error. ¿Te ayudamos a
          volver al camino?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to={ROUTES.home}>Volver al inicio</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to={ROUTES.rooms}>Ver habitaciones</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
