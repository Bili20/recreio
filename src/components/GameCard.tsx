import { Link } from 'react-router-dom'
import { GameIcon, IconSeta } from './icons'
import type { GameMeta } from '../games/games'

interface Props { game: GameMeta; recorde?: string }

export default function GameCard({ game, recorde }: Props) {
  const inner = (
    <>
      <div className="game-top">
        <span className="game-thumb"><GameIcon id={game.iconKey} /></span>
        <span className="game-arrow"><IconSeta width={20} height={20} /></span>
      </div>
      <h3>{game.nome}</h3>
      <p className="desc">{game.descricao}</p>
      <div className={`record${recorde ? '' : ' empty'}`}>
        <span className="label">{game.ativo ? 'Recorde' : 'Em breve'}</span>
        <span className="value">{game.ativo ? (recorde ?? 'Sem recorde ainda') : '—'}</span>
      </div>
    </>
  )
  if (!game.ativo) return <div className="game-card coming">{inner}</div>
  return <Link to={game.rota} className="game-card reveal">{inner}</Link>
}
