import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

// Contenedor estándar del sitio (definido como clase en globals.css para
// reutilizarlo también fuera de React si hiciera falta).
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** true = ancho máximo más amplio (grillas de 3–4 columnas). */
  wide?: boolean
}

export function Container({ wide = false, className, ...props }: ContainerProps) {
  return <div className={cn(wide ? 'container-wide' : 'container-site', className)} {...props} />
}
