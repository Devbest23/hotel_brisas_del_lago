# Guía de contenido — reemplazo 1:1

Todo el contenido del sitio es **mock editable**. Esta guía indica exactamente
en qué archivo vive cada texto, para sustituirlo por el contenido real del
hotel sin tocar código.

> Regla de oro: los datos del hotel (`HOTEL`, variables de entorno) se cambian
> en **un solo lugar** y se propagan a navbar, footer, JSON-LD, WhatsApp, etc.

---

## 1. Datos generales del hotel

**Archivo:** `src/lib/constants.ts` → objeto `HOTEL`.

| Campo | Uso |
| --- | --- |
| `name` / `fullName` | Navbar, footer, títulos SEO, JSON-LD |
| `tagline` | SEO base y Open Graph |
| `address` | Footer, contacto, JSON-LD |
| `phone` | Contacto y footer (formato visible) |
| `checkIn` / `checkOut` | Página de contacto y textos legales |
| `rating` / `reviewCount` | Hero, página "El hotel", testimonios |

⚠️ El JSON-LD base de `index.html` también incluye `telephone` y `streetAddress`
(el `+58 414-000 0000`): actualízalos ahí igualmente.

## 2. Variables de entorno (canales de contacto)

**Archivo:** `.env` (copia de `.env.example`).

| Variable | Qué cambia |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | Número que recibe las solicitudes (solo dígitos, ej. `584141234567`) |
| `VITE_CONTACT_EMAIL` | Correo que recibe solicitudes y mensajes |
| `VITE_FORMSPREE_ID` | Si se define, el canal "Correo" envía sin abrir la app de correo |
| `VITE_SITE_URL` | Dominio final: alimenta canonical, sitemap y Open Graph |

## 3. Habitaciones

**Archivo:** `src/data/rooms.ts` → array `rooms` (interfaz `Room`).

| Campo | Descripción |
| --- | --- |
| `id` | Identificador interno (`bdl-01`…), libre |
| `slug` | URL: `/habitaciones/<slug>`. **No cambiar sin actualizar** `scripts/generate-sitemap.mjs` (lista `KNOWN_ROOM_SLUGS`) |
| `name` | Nombre visible |
| `description` | 1–2 líneas para tarjetas |
| `longDescription` | Párrafo del detalle |
| `capacity`, `sizeM2`, `beds` | Ficha técnica |
| `view` | `'lago'` \| `'jardín'` \| `'piscina'` (usado por filtros) |
| `pricePerNight` | USD por noche, **entero** (evita decimales inventados) |
| `rating`, `reviewCount` | Valoración mostrada |
| `featured` | `true` = aparece en la portada |
| `amenities` | Lista de "Qué incluye" (5–6 ítems recomendado) |
| `images` | 2+ fotos con `alt` descriptivo (SEO + accesibilidad) |

Los precios de la banda "referencial" y los cálculos (`total = precio ×
noches`) se derivan solos: no hay que tocar ningún componente.

## 4. Experiencias, testimonios y FAQ

| Contenido | Archivo | Notas |
| --- | --- | --- |
| Experiencias | `src/data/experiences.ts` | `icon`: `'kayak' \| 'sunset' \| 'boat' \| 'food'` (se mapea a un icono de Lucide) |
| Testimonios | `src/data/testimonials.ts` | `rating` en escala 1–5 |
| FAQ | `src/data/faq.ts` | Se muestra en la portada **y** alimenta el JSON-LD `FAQPage` (Google puede mostrarla en resultados) |

## 5. Páginas con texto propio

| Página | Archivo | Qué editar |
| --- | --- | --- |
| Portada | `src/pages/home.tsx` + `src/features/home/*` | Título/descripción SEO; secciones en `features/home` |
| El hotel | `src/pages/about.tsx` | Historia, cifras, galería, "Un día en…" |
| Contacto | `src/pages/contact.tsx` | Encabezado y canales |
| Legales | `src/pages/legal.tsx` | Arrays `PRIVACY_SECTIONS` / `TERMS_SECTIONS` |
| Reserva | `src/pages/booking.tsx` | Encabezado del asistente |
| Reglas de la casa | `src/pages/room-detail.tsx` | Constante `HOUSE_RULES` |
| Meta base | `index.html` | Título, descripción, OG base, JSON-LD del hotel |

## 6. Fotografías

**Carpeta:** `public/images/`. Sustituir conservando nombre y proporción, o
actualizar la ruta en el archivo de datos correspondiente.

| Archivo | Uso | Proporción sugerida | Tamaño sugerido |
| --- | --- | --- | --- |
| `hero-lago.jpg` | Fondo del hero | 21:9 | ≥ 2000×860 px |
| `og-image.png` | Imagen de Open Graph (redes) | 1.91:1 | 1200×630 px |
| `hotel/fachada.jpg` | El hotel + galería | 21:9 / 4:3 | ≥ 1600 px ancho |
| `hotel/terraza.jpg`, `piscina.jpg`, `spa.jpg`, `restaurante.jpg` | Galería "Los espacios" | 4:3 | ≥ 1200 px ancho |
| `hotel/muelle-atardecer.jpg`, `lago-cabanas.jpg` | Galería + experiencias | 4:3 | ≥ 1200 px ancho |
| `rooms/<slug>.jpg` | Foto principal por habitación | 4:3 | ≥ 1400 px ancho |
| `rooms/detalle-cama.jpg` | Detalle (se reutiliza) | 4:3 | ≥ 1200 px ancho |
| `experiences/*.jpg` | Tarjetas de experiencias | 3:2 | ≥ 900 px ancho |

Consejos: exportar JPG calidad ~80, < 300 KB por foto; las imágenes usan
`loading="lazy"` automático (`SmartImage`) excepto el hero, que se carga
eager por ser el LCP.

**Créditos:** las fotos actuales son de [Unsplash](https://unsplash.com)
(licencia libre, sin atribución obligatoria). Si se regeneran con el script
`scripts/fetch-photos.mjs`, se descargan placeholders equivalentes.

## 7. Verificación tras reemplazar contenido

```bash
npm run build        # valida tipos y compila
npm run check:contrast
npm run preview      # revisar visualmente
```
