import { useCallback, useEffect, useState } from 'react'

// ============================================================================
// Tema claro / oscuro.
//
// WHY: el <html class="dark"> inicial lo aplica un script inline en index.html
// (antes de pintar, sin destello). Este hook sincroniza el toggle manual y
// persiste la elección en localStorage. Si no hay elección, respeta el sistema.
// ============================================================================

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'bdl-theme'

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function getInitialTheme(): Theme {
  const stored = getStoredTheme()
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* modo privado: se ignora */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
