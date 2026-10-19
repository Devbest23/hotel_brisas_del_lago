// ============================================================================
// Genera dist/sitemap.xml y dist/robots.txt con la URL real del despliegue.
//
// Se ejecuta como parte de `npm run build` (ver package.json). La URL se toma
// de VITE_SITE_URL (la define el workflow de GitHub Actions); si no existe,
// usa el valor de ejemplo y lo advierte.
//
// NOTA: la lista de rutas debe mantenerse sincronizada con src/data/rooms.ts
// (slugs) y src/app/router.tsx (páginas).
// ============================================================================

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const configuredUrl = process.env.VITE_SITE_URL
const SITE = (configuredUrl ?? 'https://TU-USUARIO.github.io/Hotel_Brisas_Del_Lago').replace(/\/$/, '')

const ROOM_SLUGS = [
  'vista-jardin',
  'vista-lago',
  'suite-brisa',
  'suite-familiar',
  'doble-estandar',
  'bungalow-muelle',
]

const ROUTES = [
  { path: '/', priority: '1.0' },
  { path: '/habitaciones', priority: '0.9' },
  ...ROOM_SLUGS.map((slug) => ({ path: `/habitaciones/${slug}`, priority: '0.8' })),
  { path: '/reservar', priority: '0.9' },
  { path: '/el-hotel', priority: '0.6' },
  { path: '/contacto', priority: '0.6' },
  { path: '/privacidad', priority: '0.2' },
  { path: '/terminos', priority: '0.2' },
]

const today = new Date().toISOString().slice(0, 10)

const urlEntries = ROUTES.map(
  (route) =>
    `  <url>\n    <loc>${SITE}${route.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`,
).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`

await mkdir(DIST, { recursive: true })
await writeFile(join(DIST, 'sitemap.xml'), sitemap)
await writeFile(join(DIST, 'robots.txt'), robots)

if (!configuredUrl) {
  console.warn(
    '⚠ VITE_SITE_URL no está definida: sitemap/robots usan la URL de ejemplo. ' +
      'Defínela en .env o en el workflow para producción.',
  )
}

console.log(`✓ sitemap.xml y robots.txt generados para ${SITE}`)
