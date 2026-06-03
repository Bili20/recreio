import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { GAMES } from '../games/games'

// Rotas de jogo usam o cabeçalho "game" (com voltar/título) e sem rodapé.
export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const game = GAMES.find((g) => g.rota === pathname)
  const isGame = Boolean(game)

  return (
    <>
      <Header variant={isGame ? 'game' : 'hub'} title={game?.nome} />
      <main className="wrap" style={{ paddingBlock: '32px' }}>{children}</main>
      {!isGame && <Footer />}
    </>
  )
}
