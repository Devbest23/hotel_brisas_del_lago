import { HOTEL, ROUTES } from '@/lib/constants'
import type { Room } from '@/data/rooms'
import type { FaqItem } from '@/data/faq'

// ============================================================================
// Datos estructurados (JSON-LD) y utilidades SEO.
// Ayudan a que Google muestre el hotel con estrellas, precios y FAQ en los
// resultados de búsqueda (rich results). Validar en:
// https://search.google.com/test/rich-results
// ============================================================================

/** URL absoluta para canonical / Open Graph (cae al origen actual si no hay VITE_SITE_URL). */
export function absoluteUrl(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (import.meta.env.VITE_SITE_URL) {
    return `${import.meta.env.VITE_SITE_URL.replace(/\/$/, '')}${clean}`
  }
  if (typeof window !== 'undefined') {
    // BASE_URL termina en '/'; se quita para no duplicar barras en GH Pages.
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    return `${window.location.origin}${base}${clean}`
  }
  return clean
}

export function hotelJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: HOTEL.fullName,
    description:
      'Hotel boutique minimalista a orillas del Lago de Maracaibo. Habitaciones con vista al lago, desayuno incluido y reserva directa.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Bella Vista, Sector Costa Norte',
      addressLocality: 'Maracaibo',
      addressRegion: 'Zulia',
      addressCountry: 'VE',
    },
    priceRange: '$65 - $180',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: HOTEL.rating,
      reviewCount: HOTEL.reviewCount,
    },
  }
}

export function roomJsonLd(room: Room) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.description,
    url: absoluteUrl(ROUTES.roomDetail(room.slug)),
    occupancy: { '@type': 'QuantitativeValue', maxValue: room.capacity },
    floorSize: { '@type': 'QuantitativeValue', value: room.sizeM2, unitCode: 'MTK' },
    offers: {
      '@type': 'Offer',
      price: room.pricePerNight,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
