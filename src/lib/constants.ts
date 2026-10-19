// ============================================================================
// Configuración central del sitio.
// Los valores provienen de variables de entorno PÚBLICAS de Vite (ver .env.example).
// Nunca importar secretos aquí: todo lo que empieza con VITE_ viaja al navegador.
// ============================================================================

const env = import.meta.env

/** URL pública del sitio sin barra final (canonical, sitemap, Open Graph). */
export const SITE_URL = (env.VITE_SITE_URL ?? '').replace(/\/$/, '')

/** Número de WhatsApp internacional sin símbolos (ej. 58414XXXXXXX). */
export const WHATSAPP_NUMBER = env.VITE_WHATSAPP_NUMBER || '584140000000'

/** Correo que recibe las solicitudes. */
export const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL || 'reservas@brisasdellago.com'

/** ID opcional de Formspree; si está vacío el canal por correo usa mailto. */
export const FORMSPREE_ID = env.VITE_FORMSPREE_ID || ''

/** QA: fuerza un error en la capa mock para demostrar el estado de error. */
export const MOCK_FORCE_ERROR = env.VITE_MOCK_FORCE_ERROR === 'true'

/** Rutas navegables del sitio (fuente única para router, navegación y sitemap). */
export const ROUTES = {
  home: '/',
  rooms: '/habitaciones',
  roomDetail: (slug: string) => `/habitaciones/${slug}`,
  booking: '/reservar',
  requestSent: '/reservar/solicitud-enviada',
  about: '/el-hotel',
  contact: '/contacto',
  privacy: '/privacidad',
  terms: '/terminos',
} as const

/**
 * Prefija BASE_URL a las rutas de public/ (ej. '/images/x.jpg').
 * WHY: en GitHub Pages el sitio vive en un subdirectorio (/nombre-repo/);
 * sin este prefijo las imágenes darían 404 en producción aunque en local funcionen.
 */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** Reglas de negocio del flujo de reserva (validadas en cliente con Zod). */
export const BOOKING_RULES = {
  maxNights: 14,
  minGuests: 1,
  maxGuests: 8,
  maxChildren: 4,
} as const

/** Datos de contacto del hotel (mock editable — ver docs/contenido.md). */
export const HOTEL = {
  name: 'Brisas del Lago',
  fullName: 'Hotel Brisas del Lago',
  tagline: 'Hotel boutique frente al Lago de Maracaibo',
  address: 'Av. Bella Vista, Sector Costa Norte, Maracaibo, Zulia, Venezuela',
  phone: '+58 414-000 0000',
  checkIn: '15:00',
  checkOut: '12:00',
  rating: 4.8,
  reviewCount: 312,
} as const
