import type { CSSProperties } from 'react'
import GameCard from '../components/GameCard'
import { GAMES } from '../games/games'
import type { GameId } from '../games/games'
import { useRecords } from '../hooks/useRecords'
import { RECORD_DEFS, hasRecord } from '../utils/records'

export default function Hub() {
  const { records } = useRecords()

  // Formata o recorde de cada jogo para o rodapé do card (ou undefined = "sem recorde").
  const recordeDe = (id: GameId): string | undefined => {
    const r = records[id]
    if (!hasRecord(r)) return undefined
    return RECORD_DEFS[id].format(r!.value as number)
  }

  return (
    <>
      <section className="hero reveal">
        <span className="eyebrow">Portal de jogos casuais</span>
        <h1>Seis jogos clássicos.</h1>
        <p>Joguinhos leves para qualquer momento livre — sem cadastro, sem anúncios, só o jogo. Seus recordes ficam salvos a cada partida.</p>
        <div className="stat-line">
          <span><b>6</b> jogos</span>
          <span><b>0</b> downloads — roda no navegador</span>
          <span><b>2</b> temas · 4 cores de destaque</span>
        </div>
      </section>

      <div className="section-head">
        <h2>Escolha um jogo</h2>
        <span>Toque em um card para começar</span>
      </div>

      <div className="games-grid">
        {GAMES.map((g, i) => (
          <div key={g.id} style={{ '--d': `${i * 0.05}s` } as CSSProperties}>
            <GameCard game={g} recorde={recordeDe(g.id)} />
          </div>
        ))}
      </div>
    </>
  )
}
