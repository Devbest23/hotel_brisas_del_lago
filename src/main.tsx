// WHY: solo el subset `latin` (cubre tildes y ñ): recorta ~40 archivos de
// fuentes y cientos de KB frente a importar todos los subsets del paquete.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/fraunces/latin-600.css'
import 'react-day-picker/style.css'
import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Providers } from '@/app/providers'
import { AppRouter } from '@/app/router'

// WHY: las fuentes se importan aquí (y no vía Google Fonts) para garantizar
// autohospedaje: menos latencia, mejor LCP y sin dependencia externa en runtime.

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No se encontró el elemento #root en index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      <AppRouter />
    </Providers>
  </StrictMode>,
)
