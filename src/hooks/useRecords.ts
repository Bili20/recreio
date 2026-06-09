import { useCallback, useState } from 'react'
import { loadRecords, submitRecord, incrementPlays, definirRecorde, type RecordsState } from '../utils/records'
import type { GameId } from '../games/games'

// Estado reativo dos recordes. Cada submit re-lê do storage e atualiza o estado.
export function useRecords() {
  const [records, setRecords] = useState<RecordsState>(() => loadRecords())

  const submit = useCallback((id: GameId, value: number) => {
    setRecords(submitRecord(id, value))
  }, [])

  const addPlay = useCallback((id: GameId) => {
    setRecords(incrementPlays(id))
  }, [])

  const definir = useCallback((id: GameId, value: number, plays?: number) => {
    setRecords(definirRecorde(id, value, plays))
  }, [])

  return { records, submit, addPlay, definir }
}
