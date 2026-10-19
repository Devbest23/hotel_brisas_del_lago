import { CircleAlert } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'

// Pantalla de error a nivel de router.
// WHY: si una ruta falla (o no existe), la persona ve una explicación clara con
// salidas concretas en vez de una pantalla en blanco.
export function RouteError() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-page px-4 text-center">
      <CircleAlert className="size-10 text-danger" aria-hidden="true" />
      <h1 className="font-display text-3xl font-semibold text-brand">
        {notFound ? 'Página no encontrada' : 'Ocurrió un error inesperado'}
      </h1>
      <p className="max-w-md text-muted">
        {notFound
          ? 'La dirección que abriste no existe o cambió de lugar.'
          : 'Vuelve a intentarlo. Si el problema persiste, recarga la página.'}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Recargar página
        </Button>
      </div>
    </main>
  )
}
