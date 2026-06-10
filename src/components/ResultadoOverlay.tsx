import { Link } from 'react-router-dom'
import Button from './Button'

interface Props {
  tipo: 'vitoria' | 'derrota'
  titulo: string
  detalhe?: string
  novoRecorde?: boolean
  acaoLabel?: string
  onAcao: () => void
}

// Overlay de fim de jogo, posicionado sobre a board-area. Reaproveitado por todos
// os jogos com estado terminal (série/conclusão/derrota).
export default function ResultadoOverlay({
  tipo, titulo, detalhe, novoRecorde, acaoLabel = 'Jogar de novo', onAcao,
}: Props) {
  return (
    <div className={`resultado-overlay ${tipo}`} role="alertdialog" aria-label={titulo}>
      <div className="resultado-card">
        {novoRecorde && <span className="resultado-badge">🏆 Novo recorde!</span>}
        <strong className="resultado-titulo">{titulo}</strong>
        {detalhe && <span className="resultado-detalhe">{detalhe}</span>}
        <div className="resultado-acoes">
          <Button variant="primary" onClick={onAcao}>{acaoLabel}</Button>
          <Link to="/" className="btn btn-ghost">Voltar ao início</Link>
        </div>
      </div>
    </div>
  )
}
