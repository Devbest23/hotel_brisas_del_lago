import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// WHY: `base` se inyecta desde el workflow de GitHub Actions (VITE_BASE=/nombre-del-repo/)
// para que los assets resuelvan bien cuando el sitio se sirve en un subdirectorio.
// En desarrollo local queda en '/'.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // WHY: chunks manuales = mejor caché del navegador entre despliegues.
    // El contenido del negocio (habitaciones/textos) cambia sin invalidar vendors.
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot',
            'lucide-react',
          ],
          'vendor-data': ['@tanstack/react-query', 'date-fns', 'react-day-picker'],
          'vendor-forms': ['react-hook-form', 'zod'],
        },
      },
    },
  },
})
