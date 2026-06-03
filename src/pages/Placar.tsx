import { useMemo, useState } from 'react'
import SummaryCard from '../components/SummaryCard'
import ScoreTable from '../components/ScoreTable'
import type { ScoreRow } from '../components/ScoreTable'
import Chip from '../components/Chip'
import { GAMES } from '../games/games'
import type { GameId } from '../games/games'
import { useRecords } from '../hooks/useRecords'
import { RECORD_DEFS } from '../utils/records'

// "há 2 dias", "ontem", "hoje" a partir do timestamp.
function tempoRelativo(ts: number): string {
  const dias = Math.floor((Date.now() - ts) / 86_400_000)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return `há ${dias} dias`
}

export default function Placar() {
  const { records } = useRecords()
  const [filtro, setFiltro] = useState<GameId | 'todos'>('todos')

  // Monta as linhas a partir dos jogos que têm recorde de verdade.
  const linhas: ScoreRow[] = useMemo(() => {
    return GAMES.filter((g) => {
      const r = records[g.id]
      return r && !Number.isNaN(r.value)
    })
      .filter((g) => filtro === 'todos' || g.id === filtro)
      .map((g) => {
        const r = records[g.id]!
        return {
          id: g.id,
          nome: g.nome,
          valor: RECORD_DEFS[g.id].format(r.value),
          metrica: RECORD_DEFS[g.id].metricaCurta,
          atualizado: tempoRelativo(r.updatedAt),
        }
      })
  }, [records, filtro])

  const comRecorde = Object.values(records).filter((r) => r && !Number.isNaN(r.value)).length
  const partidas = Object.values(records).reduce((s, r) => s + (r?.plays ?? 0), 0)

  return (
    <>
      <div className="placar-head">
        <span className="eyebrow">Seus números</span>
        <h1>Placar global</h1>
        <p>Os recordes pessoais de cada jogo, salvos no seu navegador.</p>
      </div>

      <div className="summary-grid">
        <SummaryCard value={String(comRecorde)} label="jogos com recorde" />
        <SummaryCard value={partidas.toLocaleString('pt-BR')} label="partidas jogadas" />
        <SummaryCard value={String(GAMES.length)} label="jogos disponíveis" />
      </div>

      <div className="filtros">
        <Chip active={filtro === 'todos'} onClick={() => setFiltro('todos')}>Todos</Chip>
        {GAMES.map((g) => (
          <Chip key={g.id} active={filtro === g.id} onClick={() => setFiltro(g.id)}>{g.nome}</Chip>
        ))}
      </div>

      <ScoreTable rows={linhas} />
    </>
  )
}
