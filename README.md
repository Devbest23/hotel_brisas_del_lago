# Hotel Brisas del Lago — sitio de reservas

SPA estática lista para producción para el **Hotel Brisas del Lago**, un hotel
boutique minimalista a orillas del Lago de Maracaibo (Venezuela). Incluye
catálogo de habitaciones, asistente de reserva de 4 pasos (sin pagos en
línea), páginas institucionales, legales y SEO técnico completo.

Proyecto académico construido con metodología por fases: análisis → diseño →
código → QA. Las decisiones están documentadas en `docs/decisiones.md` y el
estado de verificación en `docs/qa-checklist.md`.

---

## Stack

- **React 19 + TypeScript** (modo estricto) + **Vite 6**
- **Tailwind CSS v4** (tokens en `src/styles/globals.css`, sin archivo de config)
- **React Router 6** (rutas lazy con code splitting)
- **TanStack Query 5** (estados de carga/error de la capa de datos simulada)
- **React Hook Form + Zod** (validación con una sola fuente de verdad)
- **Radix UI + Lucide** (primitivas accesibles e iconografía)
- **date-fns + react-day-picker** (fechas en español)
- **Fontsource** (Inter y Fraunces autohospedadas, solo subset latin)

## Requisitos

- Node.js ≥ 20 (probado con 24)
- npm ≥ 10

## Puesta en marcha

```bash
npm install
cp .env.example .env   # en Windows: copy .env.example .env
npm run dev            # http://localhost:5173
```

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Tipos estrictos + build de producción + sitemap/robots |
| `npm run preview` | Sirve `dist/` como en producción |
| `npm run lint` | ESLint (flat config, hooks, refresh) |
| `npm run check:contrast` | Gate WCAG 2.1 AA: valida los 35 pares de color |

### Variables de entorno (públicas)

| Variable | Descripción | Default |
| --- | --- | --- |
| `VITE_SITE_URL` | URL pública sin barra final (canonical, sitemap, OG) | — |
| `VITE_BASE` | Ruta base de despliegue (`/repo/` en GitHub Pages) | `/` |
| `VITE_WHATSAPP_NUMBER` | WhatsApp que recibe solicitudes, solo dígitos | `584140000000` |
| `VITE_CONTACT_EMAIL` | Correo de contacto y solicitudes | `reservas@brisasdellago.com` |
| `VITE_FORMSPREE_ID` | Opcional: envía el correo del formulario sin backend | vacío (usa `mailto`) |
| `VITE_MOCK_FORCE_ERROR` | QA: fuerza error de la capa simulada | `false` |

> ⚠️ Todo lo que empieza con `VITE_` viaja al navegador: **nunca** pongas
> secretos en estas variables.

## Estructura del proyecto

```
├─ .github/workflows/deploy.yml   # CI: contraste → build → GitHub Pages
├─ docs/
│  ├─ contenido.md                # Guía de reemplazo de contenido 1:1
│  ├─ decisiones.md               # Decisiones de arquitectura (ADR breve)
│  └─ qa-checklist.md             # Verificación y pruebas recomendadas
├─ public/                        # favicon, og-image, robots, imágenes locales
├─ scripts/
│  ├─ check-contrast.mjs          # Gate WCAG (corre en CI)
│  ├─ fetch-photos.mjs            # Regenera placeholders de fotos
│  └─ generate-sitemap.mjs        # sitemap.xml + robots.txt en build
└─ src/
   ├─ app/                        # router y providers globales
   ├─ components/
   │  ├─ layout/                  # container, navbar, footer, back-to-top
   │  ├─ shared/                  # seo, smart-image, galería, estados async…
   │  └─ ui/                      # button, input, dialog, toast, badge…
   ├─ data/                       # habitaciones, experiencias, testimonios, FAQ
   ├─ features/
   │  ├─ booking/                 # asistente de 4 pasos + resumen
   │  ├─ contact/                 # formulario de contacto
   │  ├─ home/                    # secciones de la portada
   │  └─ rooms/                   # tarjeta y filtros de habitaciones
   ├─ lib/                        # schemas Zod, mock-api, submit, seo, format…
   ├─ pages/                      # una página por ruta (export nombrado)
   └─ styles/globals.css          # tokens de diseño, animaciones, calendario
```

La regla de dependencias es hacia adentro: **pages → features → components /
lib / data**. Ningún componente importa de una página.

## Despliegue en GitHub Pages

1. Sube el repositorio a GitHub con la rama `main`.
2. Ajustes del repo → **Pages** → Source: **GitHub Actions**.
3. (Opcional) Ajustes → Secrets and variables → Actions → **Variables**:
   define `VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_EMAIL` y `VITE_FORMSPREE_ID`
   con los datos reales del hotel.
4. Cada push a `main` compila, valida contraste y publica.

El workflow calcula solo `VITE_BASE` y `VITE_SITE_URL` a partir del nombre del
repositorio: las URLs de canonical, sitemap y Open Graph quedan correctas sin
editar archivos. También copia `index.html` → `404.html` para que las rutas
profundas funcionen en Pages.

## Personalización y contenido

Todo el contenido es mock editable y está centralizado:
consulta **`docs/contenido.md`** para reemplazarlo 1:1 (textos, precios,
fotos, datos de contacto y legales).

## Accesibilidad y calidad

- Contraste WCAG 2.1 AA verificado por script en CI (35/35 pares).
- Navegación por teclado, foco visible, `aria-live`, `prefers-reduced-motion`.
- Modo claro/oscuro con script anti-destello y preferencia persistida.
- Estados de carga, error (con reintento) y vacío en todos los flujos de datos.
- Formularios con validación en español, honeypot anti-spam y guardia de
  reenvío; sin captchas ni cookies de terceros.

## Estado del proyecto

- [x] PASO 1 — Análisis
- [x] PASO 2 — Diseño (paleta y tokens verificados)
- [x] PASO 3 — Construcción (build, lint y contraste en verde)
- [ ] PASO 4 — QA manual en dispositivos y publicación (ver `docs/qa-checklist.md`)
