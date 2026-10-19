// ============================================================================
// Descarga las fotografías placeholder desde Unsplash al repositorio.
//
// Uso:  node scripts/fetch-photos.mjs
// Requiere internet. Las fotos quedan en public/images y se commitean, de modo
// que la web funciona sin conexión (ideal para presentar el proyecto).
//
// ⚠ Antes de publicar el hotel de verdad: reemplazar por fotos propias
//   manteniendo los mismos nombres de archivo (ver docs/contenido.md).
// ============================================================================

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

// file: ruta destino | photoId: identificador de Unsplash | w: ancho solicitado
const PHOTOS = [
  { file: 'hero-lago.jpg', photoId: 'photo-1506905925346-21bda4d32df4', w: 1920 },
  { file: 'hotel/muelle-atardecer.jpg', photoId: 'photo-1439066615861-d1af74d74000', w: 1600 },
  { file: 'hotel/lago-cabanas.jpg', photoId: 'photo-1470770841072-f978cf4d019e', w: 1600 },
  { file: 'hotel/fachada.jpg', photoId: 'photo-1512917774080-9991f1c4c750', w: 1600 },
  { file: 'hotel/piscina.jpg', photoId: 'photo-1566073771259-6a8506099945', w: 1600 },
  { file: 'hotel/terraza.jpg', photoId: 'photo-1520250497591-112f2f40a3f4', w: 1600 },
  { file: 'hotel/spa.jpg', photoId: 'photo-1544161515-4ab6ce6db874', w: 1600 },
  { file: 'hotel/restaurante.jpg', photoId: 'photo-1414235077428-338989a2e8c0', w: 1600 },
  { file: 'experiences/gastronomia.jpg', photoId: 'photo-1504674900247-0877df9cc836', w: 1600 },
  { file: 'rooms/vista-jardin.jpg', photoId: 'photo-1582719478250-c89cae4dc85b', w: 1200 },
  { file: 'rooms/vista-lago.jpg', photoId: 'photo-1590490360182-c33d57733427', w: 1200 },
  { file: 'rooms/suite-brisa.jpg', photoId: 'photo-1611892440504-42a792e24d32', w: 1200 },
  { file: 'rooms/suite-familiar.jpg', photoId: 'photo-1445019980597-93fa8acb246c', w: 1200 },
  { file: 'rooms/doble-estandar.jpg', photoId: 'photo-1571003123894-1f0594d2b5d9', w: 1200 },
  { file: 'rooms/bungalow-muelle.jpg', photoId: 'photo-1499793983690-e29da59ef1c2', w: 1200 },
  { file: 'rooms/detalle-cama.jpg', photoId: 'photo-1578683010236-d716f9a3f461', w: 1200 },
  { file: 'experiences/kayak.jpg', photoId: 'photo-1476514525535-07fb3b4ae5f1', w: 1600 },
  { file: 'experiences/atardecer-muelle.jpg', photoId: 'photo-1507525428034-b723cf961d3e', w: 1600 },
  { file: 'experiences/tour-lago.jpg', photoId: 'photo-1500375592092-40eb2168fd21', w: 1600 },
]

let ok = 0
const failed = []

for (const photo of PHOTOS) {
  const url = `https://images.unsplash.com/${photo.photoId}?auto=format&fit=crop&w=${photo.w}&q=72`
  const target = join(ROOT, photo.file)

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.length < 10_000) throw new Error(`Archivo sospechosamente pequeño (${buffer.length} B)`)

    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, buffer)
    ok++
    console.log(`OK    ${photo.file}  (${(buffer.length / 1024).toFixed(0)} KB)`)
  } catch (error) {
    failed.push(photo.file)
    console.log(`FALLO ${photo.file}  ->  ${error.message}`)
  }
}

console.log(`\n${ok}/${PHOTOS.length} fotos descargadas.`)
if (failed.length > 0) {
  console.log('Fallidas:', failed.join(', '))
  process.exitCode = 1
}
