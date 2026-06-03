import { GameIcon } from './icons'
import type { GameId } from '../games/games'

export interface ScoreRow {
  id: GameId
  nome: string
  valor: string
  metrica: string
  atualizado: string
}

export default function ScoreTable({ rows }: { rows: ScoreRow[] }) {
  if (rows.length === 0) {
    return <p style={{ color: 'var(--muted)' }}>Nenhum recorde ainda — jogue uma partida para começar.</p>
  }
  return (
    <table className="score-table">
      <thead>
        <tr>
          <th>#</th><th>Jogo</th><th>Recorde</th>
          <th className="hide-sm">Métrica</th>
          <th className="hide-sm text-right">Atualizado</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id}>
            <td className="score-rank">{i + 1}</td>
            <td>
              <span className="score-game">
                <span className="score-mini"><GameIcon id={r.id} width={20} height={20} /></span>
                {r.nome}
              </span>
            </td>
            <td className="score-value">{r.valor}</td>
            <td className="hide-sm" style={{ color: 'var(--muted)' }}>{r.metrica}</td>
            <td className="hide-sm text-right" style={{ color: 'var(--muted)' }}>{r.atualizado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
