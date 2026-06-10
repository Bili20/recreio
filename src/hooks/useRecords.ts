import { useCallback, useState } from 'react'
import { loadRecords, submitRecord, incrementPlays, definirRecorde, type RecordsState } from '../utils/records'
import type { GameId } from '../games/games'

// Estado reativo dos recordes. Cada submit re-lê do storage e atualiza o estado.
export function useRecords() {
  const [records, setRecords] = useState<RecordsState>(() => loadRecords())

  // Retorna se o resultado bateu o recorde (para o jogo exibir o selo).
  const submit = useCallback((id: GameId, value: number): boolean => {
    const { state, novoRecorde } = submitRecord(id, value)
    setRecords(state)
    return novoRecorde
  }, [])

  const addPlay = useCallback((id: GameId) => {
    setRecords(incrementPlays(id))
  }, [])

  const definir = useCallback((id: GameId, value: number, plays?: number) => {
    setRecords(definirRecorde(id, value, plays))
  }, [])

  return { records, submit, addPlay, definir }
}
