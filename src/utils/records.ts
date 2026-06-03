import { readJSON, writeJSON } from './storage'
import type { GameId } from '../games/games'

const KEY = 'recreio-records'

export interface RecordEntry {
  value: number
  updatedAt: number
  plays: number // partidas jogadas (para o resumo do placar)
}

export type RecordsState = Partial<Record<GameId, RecordEntry>>

interface RecordDef {
  metricaCurta: string            // ex.: "vitórias seguidas" (coluna MÉTRICA do placar)
  melhor: 'maior' | 'menor'       // direção que define recorde
  format: (v: number) => string   // exibição amigável do valor
  rotuloPainel: string            // rótulo usado no hub/painel (ex.: "Recorde")
}

// Formata segundos -> m:ss
const fmtTempo = (s: number) => {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}

// Definições por jogo. Apenas 'velha' é exercitada na Fase 1; as demais já ficam
// preparadas para a Fase 2.
export const RECORD_DEFS: Record<GameId, RecordDef> = {
  velha:   { metricaCurta: 'vitórias seguidas', melhor: 'maior', rotuloPainel: 'Recorde',
             format: (v) => `${v} vitórias seguidas` },
  jokenpo: { metricaCurta: 'séries vencidas', melhor: 'maior', rotuloPainel: 'Recorde',
             format: (v) => `${v} seguidas` },
  memoria: { metricaCurta: 'melhor tempo', melhor: 'menor', rotuloPainel: 'Melhor tempo',
             format: (v) => fmtTempo(v) },
  g2048:   { metricaCurta: 'pontos', melhor: 'maior', rotuloPainel: 'Recorde',
             format: (v) => v.toLocaleString('pt-BR') },
  forca:   { metricaCurta: 'aproveitamento', melhor: 'maior', rotuloPainel: 'Aproveitamento',
             format: (v) => `${v}%` },
  sudoku:  { metricaCurta: 'melhor tempo', melhor: 'menor', rotuloPainel: 'Melhor tempo',
             format: (v) => fmtTempo(v) },
}

export const loadRecords = (): RecordsState => readJSON<RecordsState>(KEY, {})

function isBetter(id: GameId, novo: number, atual: number): boolean {
  return RECORD_DEFS[id].melhor === 'maior' ? novo > atual : novo < atual
}

// Submete um resultado; só substitui o valor se for melhor. Sempre soma +1 partida.
export function submitRecord(id: GameId, value: number): RecordsState {
  const recs = loadRecords()
  const prev = recs[id]
  const plays = (prev?.plays ?? 0) + 1
  if (!prev || isBetter(id, value, prev.value)) {
    recs[id] = { value, updatedAt: Date.now(), plays }
  } else {
    recs[id] = { ...prev, plays }
  }
  writeJSON(KEY, recs)
  return recs
}

// Soma uma partida sem mexer no recorde (ex.: rodada perdida).
export function incrementPlays(id: GameId): RecordsState {
  const recs = loadRecords()
  const prev = recs[id]
  recs[id] = prev
    ? { ...prev, plays: prev.plays + 1 }
    : { value: NaN, updatedAt: Date.now(), plays: 1 }
  writeJSON(KEY, recs)
  return recs
}
