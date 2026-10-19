// ============================================================================
// Verificación automática de contraste WCAG 2.1 (AA) del sistema de diseño.
//
// Se ejecuta en CI antes del build (y con `npm run check:contrast`).
// Si un par de colores baja del umbral, el proceso falla: nadie publica una
// versión con contraste roto.
//
// Fórmula oficial: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
// ============================================================================

function luminance(hex) {
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
  const linear = channels.map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrastRatio(foreground, background) {
  const a = luminance(foreground)
  const b = luminance(background)
  const [high, low] = a > b ? [a, b] : [b, a]
  return (high + 0.05) / (low + 0.05)
}

// [fondo, texto, umbral, descripción] — umbral 4.5 = texto normal; 3 = no-texto
const PAIRS = [
  // Tema claro
  ['#faf7f2', '#003049', 4.5, 'L · texto principal sobre fondo'],
  ['#ffffff', '#003049', 4.5, 'L · texto principal sobre superficie'],
  ['#faf7f2', '#780000', 4.5, 'L · títulos (marca) sobre fondo'],
  ['#faf7f2', '#52616b', 4.5, 'L · texto secundario sobre fondo'],
  ['#ffffff', '#52616b', 4.5, 'L · texto secundario sobre superficie'],
  ['#780000', '#faf7f2', 4.5, 'L · botón primario (claro sobre vino)'],
  ['#ae1f23', '#faf7f2', 4.5, 'L · banda CTA (claro sobre rojo)'],
  ['#003049', '#faf7f2', 4.5, 'L · botón azul (claro sobre navy)'],
  ['#faf7f2', '#c1121f', 4.5, 'L · acento carmesí sobre fondo'],
  ['#faf7f2', '#660bbc', 4.5, 'L · enlaces sobre fondo'],
  ['#ffffff', '#660bbc', 4.5, 'L · enlaces sobre superficie'],
  ['#faf7f2', '#8a7a6a', 3.0, 'L · bordes de controles (no-texto)'],
  ['#f1eae0', '#003049', 4.5, 'L · texto sobre sección alterna'],
  ['#fce8e6', '#8c1b13', 4.5, 'L · error: texto sobre tinte'],
  ['#b3261e', '#ffffff', 4.5, 'L · error: sólido con texto blanco'],
  ['#faf7f2', '#b3261e', 4.5, 'L · error: texto/icono sobre fondo'],
  ['#e7f5ec', '#0e6f46', 4.5, 'L · éxito: texto sobre tinte'],
  ['#0e6f46', '#ffffff', 4.5, 'L · éxito: sólido con texto blanco'],
  ['#fff4db', '#8a5a00', 4.5, 'L · advertencia: texto sobre tinte'],
  ['#b45309', '#ffffff', 4.5, 'L · advertencia: sólido con texto blanco'],
  ['#e7f0fb', '#0b6bcb', 4.5, 'L · info: texto sobre tinte'],
  ['#0b6bcb', '#ffffff', 4.5, 'L · info: sólido con texto blanco'],
  ['#2c4f66', '#faf7f2', 4.5, 'L · texto sobre velo de fotografía'],
  // Tema oscuro
  ['#002233', '#f3efe7', 4.5, 'D · texto principal sobre fondo'],
  ['#003049', '#f3efe7', 4.5, 'D · texto principal sobre superficie'],
  ['#002233', '#a9bac4', 4.5, 'D · texto secundario sobre fondo'],
  ['#003049', '#a9bac4', 4.5, 'D · texto secundario sobre superficie'],
  ['#002233', '#bd9bf0', 4.5, 'D · enlaces sobre fondo'],
  ['#002233', '#f6c6c0', 4.5, 'D · marca/títulos sobre fondo'],
  ['#003049', '#7ba7bc', 3.0, 'D · bordes de controles (no-texto)'],
  ['#0a3b52', '#f3efe7', 4.5, 'D · texto sobre superficie elevada'],
  ['#3a1d1f', '#ffb4ab', 4.5, 'D · error: texto sobre tinte'],
  ['#123a26', '#a8e6bd', 4.5, 'D · éxito: texto sobre tinte'],
  ['#3d2e12', '#ffddb0', 4.5, 'D · advertencia: texto sobre tinte'],
  ['#122e4a', '#b3d4ff', 4.5, 'D · info: texto sobre tinte'],
]

let failures = 0

console.log('\nVerificación de contraste WCAG 2.1 (AA)\n' + '─'.repeat(66))

for (const [background, foreground, threshold, label] of PAIRS) {
  const ratio = contrastRatio(foreground, background)
  const pass = ratio >= threshold
  if (!pass) failures++
  const mark = pass ? '✓' : '✗ FALLA'
  console.log(
    `${mark.padEnd(8)} ${ratio.toFixed(2).padStart(6)}:1  (mín ${threshold})  ${label}`,
  )
}

console.log('─'.repeat(66))

if (failures > 0) {
  console.error(`\n✗ ${failures} par(es) de color no cumplen WCAG AA. Corrige globals.css.\n`)
  process.exit(1)
}

console.log(`\n✓ ${PAIRS.length}/${PAIRS.length} pares cumplen WCAG 2.1 AA.\n`)
