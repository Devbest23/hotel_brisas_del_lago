/// <reference types="vite/client" />

// Tipado de las variables de entorno públicas (ver .env.example).
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_BASE?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_FORMSPREE_ID?: string
  readonly VITE_MOCK_FORCE_ERROR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
