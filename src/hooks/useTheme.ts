import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { readJSON } from '../utils/storage'

export type Theme = 'light' | 'dark'
const KEY = 'recreio-theme'

// Default = preferência do sistema quando não há escolha salva.
function initialTheme(): Theme {
  const saved = readJSON<Theme | null>(KEY, null)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(KEY, initialTheme())

  // Reflete a escolha no <html data-theme> para o CSS reagir.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}
