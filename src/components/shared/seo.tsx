import { useEffect } from 'react'

import { absoluteUrl } from '@/lib/seo'
import { HOTEL } from '@/lib/constants'

// ============================================================================
// Gestión de metadatos por ruta (título, description, Open Graph, canonical,
// robots y datos estructurados JSON-LD).
//
// LIMITACIÓN CONOCIDA (documentada en docs/decisiones.md): al ser una SPA,
// estos metadatos los aplica el navegador al navegar. Para enlaces compartidos
// de rutas profundas, la solución de fase 2 es prerenderizar en el build.
// ============================================================================

interface SeoProps {
  title: string
  description: string
  /** Ruta de la página, ej. '/habitaciones' (se convierte en URL absoluta). */
  path: string
  /** Imagen social (ruta en /public o URL absoluta). */
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  /** Datos estructurados (schema.org). */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function Seo({
  title,
  description,
  path,
  image = '/og-image.png',
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  // Serializar evita re-ejecutar el efecto en cada render por identidad del objeto.
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const fullTitle = `${title} · ${HOTEL.fullName}`
    const url = absoluteUrl(path)
    const imageUrl = image.startsWith('http') ? image : absoluteUrl(image)

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('name', 'twitter:card', 'summary_large_image')

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex,nofollow')
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    // JSON-LD propio de la ruta (se limpia el anterior al navegar).
    document.head.querySelectorAll('script[data-bdl-jsonld]').forEach((node) => node.remove())
    if (jsonLdString) {
      const parsed = JSON.parse(jsonLdString) as Record<string, unknown> | Array<Record<string, unknown>>
      const blocks = Array.isArray(parsed) ? parsed : [parsed]
      for (const block of blocks) {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-bdl-jsonld', '')
        script.textContent = JSON.stringify(block)
        document.head.appendChild(script)
      }
    }
  }, [title, description, path, image, type, noindex, jsonLdString])

  return null
}
