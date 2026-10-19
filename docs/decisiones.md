# Decisiones técnicas — Hotel Brisas del Lago

Registro de las decisiones de arquitectura del proyecto, en formato breve ADR
(contexto → decisión → consecuencias). Cada decisión incluye el **por qué**
para que el equipo pueda revisarla o sustituirla con conocimiento de causa.

---

## 1. SPA 100 % estática, sin backend ni base de datos

**Contexto.** El enunciado exige un sitio de reservas profesional, desplegable
en GitHub Pages (solo archivos estáticos), para un hotel que hoy gestiona
reservas por WhatsApp.

**Decisión.** El sitio es una aplicación de una sola página (React + Vite) que
se compila a archivos estáticos. No hay servidor propio, base de datos ni
pagos en línea.

**Consecuencias.**

- Coste de hosting cero y despliegue trivial (GitHub Pages).
- El sitio **no confirma reservas**: gestiona *solicitudes*. La confirmación
  ocurre después, en la conversación con el hotel.
- La disponibilidad mostrada es referencial (ver decisión 3).
- Si el hotel quisiera reservas 100 % automáticas más adelante, haría falta un
  backend o servicio externo (p. ej. un channel manager); la capa
  `src/lib/submit.ts` está aislada precisamente para facilitar ese cambio.

## 2. Canales de envío: WhatsApp (principal), Formspree (opcional), correo

**Contexto.** Sin backend, la solicitud debe llegar al hotel por algún canal
gratuito y verificable.

**Decisión.** `src/lib/submit.ts` es un adaptador con tres canales:

1. **WhatsApp** (`wa.me` con mensaje prellenado): canal por defecto, es el
   hábito real del hotel y no depende de servicios de terceros.
2. **Formspree** (si `VITE_FORMSPREE_ID` está definido): envío de correo sin
   backend, con `fetch` directo desde el navegador.
3. **mailto**: respaldo si no hay Formspree; abre la aplicación de correo del
   visitante con asunto y cuerpo prellenados.

**Consecuencias.**

- Semántica honesta: cuando el canal es manual (WhatsApp/mailto), la página de
  confirmación dice **"tu solicitud está lista (pendiente de enviar)"**, no
  "enviada". El campo `manual` de `SubmittedRequest` controla ese texto.
- La apertura de WhatsApp/correo ocurre **antes** de cualquier `await` (gesto
  de usuario directo) para que el navegador no bloquee la ventana emergente.
- Sin Formspree no hay almacenamiento: el hotel recibe todo en su bandeja.

## 3. Disponibilidad simulada, determinista y declarada

**Contexto.** Una demo académica no puede consultar un sistema de reservas
real, pero los estados "disponible / bajo consulta" deben ser estables y
creíbles (sin parpadeos aleatorios entre renders).

**Decisión.** `src/lib/availability.ts` genera disponibilidad con un hash
FNV-1a sobre un identificador estable (habitación + fechas). La capa
`src/lib/mock-api.ts` añade latencia simulada para que la interfaz ejerza sus
estados reales de carga/error. `VITE_MOCK_FORCE_ERROR=true` fuerza un error.

**Consecuencias.**

- Mismo resultado para los mismos datos: la demo es reproducible.
- La interfaz **siempre** declara que la disponibilidad es referencial y que
  el hotel confirma antes de cualquier pago (no induce a error).
- Sustituir la capa mock por un servicio real solo toca `mock-api.ts`.

## 4. Stack: React 19 + Vite 6 + Tailwind v4 + Radix + TanStack Query + RHF/Zod

**Contexto.** Se pedía un stack moderno, mantenible y sin dependencias
inventadas.

**Decisión y por qué de cada pieza.**

| Pieza | Rol | Por qué |
| --- | --- | --- |
| React 19 + TypeScript estricto | UI y seguridad de tipos | Estándar del mercado; `strict` + `noUnusedLocals` atrapan errores en build |
| Vite 6 | Build y dev server | Rápido, estándar para SPA, soporta `base` para GitHub Pages |
| Tailwind v4 | Estilos | Tokens en CSS (`@theme inline`) sin `tailwind.config.js`; utilidades consistentes |
| Radix UI (accordion, dialog, slot) | Primitivas accesibles | Gestión de foco, ARIA y teclado resuelta; estilo propio |
| Lucide | Iconografía | SVG tree-shakeable, coherente |
| React Router 6 | Rutas | `lazy()` por ruta = code splitting; `basename` resuelve el subdirectorio de Pages |
| TanStack Query 5 | Estado del servidor (mock) | Estados de carga/error/reintento sin `useEffect` manual |
| React Hook Form + Zod | Formularios y validación | Un solo esquema de validación reutilizado por buscador y asistente |
| date-fns + react-day-picker | Fechas y calendario | Locale `es`, rangos, accesible por teclado |
| Fontsource (Inter, Fraunces) | Tipografías | Autohospedadas: sin peticiones a Google en runtime (privacidad + LCP) |

## 5. Validación: Zod como única fuente de verdad, sin `@hookform/resolvers`

**Contexto.** RHF + Zod es habitual, pero el resolver oficial duplica la
validación dentro de RHF y puede desincronizarse con los tipos transformados
por Zod.

**Decisión.** Los esquemas viven en `src/lib/schemas.ts`. El puente
(`src/lib/form.ts`, `applyZodErrors`) convierte los issues de Zod en errores de
RHF. El buscador del hero y el asistente usan **los mismos** esquemas.

**Consecuencias.**

- Un cambio de regla (p. ej. mínimo de noches) se hace en un solo archivo.
- Menos dependencias y control total de los mensajes de error en español.

## 6. Paleta WCAG 2.1 AA verificada por script, tokens por función

**Contexto.** La paleta de marca original (#003049 + rojo) no cumplía AA en
todos los pares texto/fondo.

**Decisión.** Cada color tiene un **rol** (`--ink`, `--muted`, `--brand`,
`--link`, `--accent`, estados semánticos…). Los pares se validan con
`scripts/check-contrast.mjs` (35 pares, mínimo AA; 3:1 para elementos no
textuales). El script corre en CI **antes** del build: un cambio de color que
rompa AA bloquea el despliegue.

**Consecuencias.**

- El color nunca es el único indicador de estado: siempre lo acompañan texto o
  icono (WCAG 1.4.1).
- Los tokens semánticos (`success`, `warning`, `danger`, `info`) tienen par
  claro/oscuro para fondo y texto.

## 7. Modo oscuro por clase `.dark` + script anti-destello

**Decisión.** El tema se aplica con la clase `.dark` en `<html>` (variante
`@custom-variant dark`), decidido por: (1) preferencia guardada en
`localStorage['bdl-theme']`, o (2) `prefers-color-scheme`. Un script inline en
`index.html` lo aplica **antes del primer pintado** (sin parpadeo).

**Por qué no solo `prefers-color-scheme`:** el usuario necesita poder forzar el
tema; guardar la elección es la expectativa estándar. El sistema decide los
valores iniciales (decisión conservadora por defecto).

## 8. Fotografías locales, no URLs remotas

**Contexto.** En la fase de diseño se optó por placeholders remotos de
Unsplash. Durante la construcción, las URLs remotas resultaron frágiles
(rate-limit/403 esporádicos) y hacían depender la demo de un CDN externo.

**Decisión (revisada).** `scripts/fetch-photos.mjs` descarga las 19 fotos
usadas a `public/images/` y los datos las referencian como rutas locales.
`asset()` (en `constants.ts`) prefija `BASE_URL` para que funcionen en el
subdirectorio de GitHub Pages. La variable `VITE_LOCAL_IMAGES` se eliminó.

**Consecuencias.**

- La demo es autocontenida y funciona sin red externa.
- Antes de publicar, reemplazar por fotografía real del hotel
  (ver `docs/contenido.md`); créditos de Unsplash documentados allí.

## 9. Enrutado con code splitting y truco 404.html para GitHub Pages

**Decisión.** `createBrowserRouter` con `basename = import.meta.env.BASE_URL`.
La portada se carga eager; el resto con `lazy()` + `Suspense`. En CI, el
workflow copia `dist/index.html` → `dist/404.html`: GitHub Pages sirve ese
archivo en rutas profundas y el router resuelve la vista al hidratar.
`vite.config.ts` separa _vendors_ en chunks manuales para mejor caché.

**Consecuencias.**

- Navegación interna instantánea y chunks pequeños (~5–25 KB gzip por página).
- Recargar `/habitaciones/vista-lago` directamente funciona en producción.
- En `vite preview`/dev no aplica el truco 404: usar navegación interna.

## 10. SEO en SPA: componente `<Seo />` por ruta + JSON-LD

**Contexto.** Una SPA sin prerender no tiene HTML por ruta; los buscadores
modernos sí ejecutan JavaScript.

**Decisión.** Cada página declara su `<Seo title description path image jsonLd />`:
actualiza `document.title`, `meta[name=description]`, canonical, Open Graph,
Twitter y un bloque JSON-LD (`Hotel`, `FAQPage`, `Product`-equivalente de
habitación `HotelRoom`, `BreadcrumbList`). `index.html` incluye metadatos base
para scrapers que no ejecutan JS. `scripts/generate-sitemap.mjs` genera
`sitemap.xml` y `robots.txt` en el build usando `VITE_SITE_URL` y los slugs
reales de habitaciones.

**Consecuencias.**

- No se añadió prerender/SSG (alcance académico); documentado como límite.
- Si algún día se necesita HTML completo por ruta, migrar a un plugin SSG sin
  cambiar los componentes.

## 11. Anti-spam sin captcha: honeypot + guardia de reenvío

**Decisión.** Campo trampa `website` (oculto y fuera del orden de tabulación:
lo rellenan solo bots) + guardia de 5 s entre envíos (`sessionStorage`) +
validación Zod. Sin reCAPTCHA ni servicios con cookies de terceros.

**Consecuencias.**

- Cero fricción para personas, cero dependencias externas.
- Suficiente para el volumen del hotel; si apareciera spam real, Formspree ya
  incluye su propio filtrado.

## 12. Borrador de reserva en `sessionStorage`

**Decisión.** El asistente persiste su borrador en
`sessionStorage['bdl-booking-draft']` (se borra al cerrar la pestaña). El
honeypot jamás se persiste. La página de confirmación guarda
`bdl-last-request` para sobrevivir a una recarga.

**Por qué no URL ni localStorage:** la URL no debe llevar datos personales
(quedarían en historial); localStorage sobreviviría demasiado tiempo en
equipos compartidos.

## 13. Límites conocidos (declarados honestamente)

- **No hay confirmación automática de reservas** ni bloqueo anti doble-reserva:
  es una demo estática; el hotel confirma en la conversación.
- **Sin pagos en línea**: decisión del hotel (comisiones y confianza).
- **Contenido y fotos son mock** hasta que el hotel entregue los reales.
- **Los textos legales** son plantillas de ejemplo: requieren revisión legal
  antes de uso comercial.
- **Sin prerender**: el SEO depende de que el crawler ejecute JS (aceptable
  para el alcance; ver decisión 10).
