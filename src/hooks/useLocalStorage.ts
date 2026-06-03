import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

// Estado React espelhado em localStorage. Lazy init lê uma vez na montagem.
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJSON(key, initial))

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        writeJSON(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, set] as const
}
