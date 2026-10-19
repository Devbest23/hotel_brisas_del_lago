# Checklist de QA — Hotel Brisas del Lago

Estado de la verificación de la entrega (PASO 4). Se separa lo **verificado
automáticamente** (con evidencia reproducible) de las **pruebas manuales
recomendadas** antes de publicar.

---

## 1. Verificado automáticamente en la entrega

| Verificación | Comando | Resultado |
| --- | --- | --- |
| Tipos en modo estricto (`strict`, `noUnusedLocals`) | `tsc -b` (dentro de `npm run build`) | ✅ 0 errores |
| Build de producción + code splitting | `npm run build` | ✅ 3135 módulos, chunks por página (~5–25 KB gzip) |
| Sitemap y robots generados en build | `node scripts/generate-sitemap.mjs` (dentro del build) | ✅ `dist/sitemap.xml`, `dist/robots.txt` |
| Contraste WCAG 2.1 AA (gate de CI) | `npm run check:contrast` | ✅ 35/35 pares AA (3:1 en elementos no textuales) |
| Lint (ESLint flat config + react-hooks) | `npm run lint` | ✅ 0 errores (3 avisos intencionales de react-refresh por hook+componente en el mismo archivo) |
| Peso de fuentes optimizado (subset `latin`) | `npm run build` | ✅ 8 archivos de fuente (antes ~40) |

### Cómo reproducirlo

```bash
npm ci
npm run check:contrast
npm run lint
npm run build
npm run preview   # http://localhost:4173
```

Estados especiales para QA:

```bash
# Fuerza error en la capa de datos simulada (probar estado de error + Reintentar)
VITE_MOCK_FORCE_ERROR=true npm run dev
# Windows PowerShell:
$env:VITE_MOCK_FORCE_ERROR='true'; npm run dev
```

---

## 2. Checklist manual recomendado (antes de publicar)

### 2.1 Flujo de reserva (el camino crítico)

- [ ] Hero → elegir fechas válidas → navega a `/reservar` con los datos ya
      cargados y el paso adelantado.
- [ ] Validaciones: salir antes de llegar (mensaje "La salida debe ser
      posterior a la llegada"), más de 14 noches, fechas pasadas (deshabilitadas
      en el calendario y bloqueadas por Zod).
- [ ] Paso 2: la disponibilidad mostrada es estable al recargar (misma
      habitación = mismo estado) y muestra la etiqueta "referencial".
- [ ] Paso 3: enviar vacío muestra errores en español junto a cada campo y
      mueve el foco al primero con error.
- [ ] Paso 4: sin aceptar términos no envía (error bajo la casilla).
- [ ] Enviar por WhatsApp: se abre `wa.me` con el mensaje completo (fechas,
      habitación, huésped, notas) y la página de confirmación dice
      **"Pendiente de envío en tu app"** (semántica honesta).
- [ ] Enviar por correo sin `VITE_FORMSPREE_ID`: abre la app de correo con
      asunto y cuerpo; con Formspree configurado: envía y dice "Recibida".
- [ ] Doble clic en "Enviar": bloqueado por la guardia de 5 s.
- [ ] Recargar `/reservar/solicitud-enviada` conserva el resumen (sessionStorage).
- [ ] "Descargar recordatorio (.ics)" genera un archivo que abre en Google/Apple
      Calendar con las fechas correctas.
- [ ] "Copiar resumen" copia el texto (probar sin HTTPS: debe mostrar el aviso
      de fallo, no romperse).

### 2.2 Navegación y enlaces

- [ ] Todas las rutas del navbar y footer abren la página correcta.
- [ ] Recarga en profundidad funciona en producción (el truco `404.html` de
      GitHub Pages; en `npm run preview` solo funciona la navegación interna).
- [ ] URL inexistente → página 404 con salidas ("Volver al inicio", "Ver
      habitaciones").
- [ ] Enlaces externos (WhatsApp, mapa, Unsplash) abren en pestaña nueva con
      `rel="noreferrer"`.

### 2.3 Accesibilidad (WCAG 2.1 AA)

- [ ] Recorrido completo por teclado: navbar → hero → asistente → envío. Foco
      visible (outline morado) en cada elemento interactivo.
- [ ] Modal de galería: foco atrapado dentro, `Esc` cierra, el foco vuelve al
      botón original.
- [ ] Lector de pantalla (NVDA/VoiceOver): encabezados jerárquicos (h1 único
      por página), anuncio `aria-live` al cambiar de paso, errores de
      formulario anunciados (`role="alert"`).
- [ ] Zoom 200 % sin pérdida de contenido ni scroll horizontal.
- [ ] `prefers-reduced-motion`: las animaciones se reducen (ver base CSS).
- [ ] Modo oscuro: toggle, contraste verificado por script, y sin destello al
      recargar (script anti-FOUC).

### 2.4 Responsive

- [ ] 320 px (iPhone SE): sin scroll horizontal; buscador y calendario usables.
- [ ] 768 px, 1024 px, 1440 px: grillas correctas (1 → 2 → 3 columnas).
- [ ] Menú móvil: abre/cierra, bloquea el scroll de fondo, navega bien.

### 2.5 SEO y metadatos

- [ ] `document.title` y canonical cambian en cada ruta (devtools → Elements).
- [ ] Verificar `dist/sitemap.xml` con las 9 URLs y `robots.txt` con el dominio
      real (requiere `VITE_SITE_URL` definida).
- [ ] Compartir una URL en WhatsApp/Telegram: aparece tarjeta con título,
      descripción e imagen (`og-image.png`).
- [ ] Rich Results Test (Google) sobre la portada: `Hotel` + `FAQPage` sin
      errores; detalle de habitación: `HotelRoom` + `BreadcrumbList`.
- [ ] Lighthouse (modo incógnito, `npm run preview`): Performance ≥ 90,
      Accessibility 100, Best Practices ≥ 95, SEO ≥ 95.

### 2.6 Contenido

- [ ] Buscar `TODO`, `Lorem`, `000 0000` y `TU-USUARIO` en `src/` y `public/`:
      no debe quedar ninguno antes de publicar.
- [ ] Precios y nombres de habitaciones coinciden con la lista real del hotel.
- [ ] Reemplazar teléfono/email en `.env` **y** en el JSON-LD de `index.html`.
- [ ] Textos legales revisados con asesoría real (hoy son plantillas).

---

## 3. Riesgos conocidos (aceptados y documentados)

| Riesgo | Mitigación actual |
| --- | --- |
| Sin confirmación automática de reservas | La interfaz lo declara; el hotel confirma en la conversación (ver `docs/decisiones.md`) |
| Disponibilidad simulada | Etiqueta "referencial" visible; hash determinista para demos reproducibles |
| `window.open` de WhatsApp bloqueado por el navegador | Se abre antes de cualquier `await`; si aun así se bloquea, la página de confirmación incluye botón "Abrir WhatsApp con el resumen" |
| SEO de SPA sin prerender | Metadatos base en `index.html`, JSON-LD por ruta, sitemap real; prerender como mejora futura |
