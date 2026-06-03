import type { SVGProps, JSX } from 'react'
import type { GameId } from '../games/games'

type IconProps = SVGProps<SVGSVGElement>
const base = (p: IconProps) => ({
  width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, ...p,
})

export const IconLua = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
)
export const IconSol = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>
)
export const IconVoltar = (p: IconProps) => (
  <svg {...base(p)}><path d="M15 18l-6-6 6-6" /></svg>
)
export const IconSeta = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 17 17 7M9 7h8v8" /></svg>
)

// Ícones geométricos por jogo (traço simples, combinam com os thumbs dos mockups)
const GAME_ICONS: Record<GameId, JSX.Element> = {
  velha: <><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></>,
  jokenpo: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M6 15c1.5 2 4 3 6 3s4.5-1 6-3" /></>,
  memoria: <><rect x="3" y="4" width="7" height="16" rx="1.5" /><rect x="14" y="4" width="7" height="16" rx="1.5" /></>,
  g2048: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  forca: <><path d="M5 21V3h9M5 3v4a4 4 0 0 0 4 4M14 3l3 3-3 3" /></>,
  sudoku: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></>,
}

export const GameIcon = ({ id, ...p }: { id: GameId } & IconProps) => (
  <svg {...base(p)}>{GAME_ICONS[id]}</svg>
)

export const IconPedra = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="7" /></svg>
)
export const IconPapel = (p: IconProps) => (
  <svg {...base(p)}><rect x="5" y="5" width="14" height="14" rx="3" /></svg>
)
export const IconTesoura = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
