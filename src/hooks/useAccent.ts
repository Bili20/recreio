import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Accent = 'indigo' | 'teal' | 'orange' | 'rose'
export const ACCENTS: { id: Accent; nome: string }[] = [
  { id: 'indigo', nome: 'Índigo' },
  { id: 'teal', nome: 'Verde-água' },
  { id: 'orange', nome: 'Laranja' },
  { id: 'rose', nome: 'Rosa' },
]

export function useAccent() {
  const [accent, setAccent] = useLocalStorage<Accent>('recreio-accent', 'indigo')
  useEffect(() => {
    document.documentElement.dataset.accent = accent
  }, [accent])
  return { accent, setAccent }
}
