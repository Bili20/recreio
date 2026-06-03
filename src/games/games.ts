export type GameId = 'velha' | 'jokenpo' | 'memoria' | 'g2048' | 'forca' | 'sudoku'

export interface GameMeta {
  id: GameId
  nome: string
  rota: string
  descricao: string
  iconKey: GameId // chave usada por components/icons.tsx
  ativo: boolean  // false = "Em breve" (Fase 2)
}

export const GAMES: GameMeta[] = [
  { id: 'velha', nome: 'Jogo da Velha', rota: '/velha', iconKey: 'velha', ativo: true,
    descricao: 'Clássico X e O. Alinhe três e leve a melhor contra a máquina.' },
  { id: 'jokenpo', nome: 'Pedra, Papel, Tesoura', rota: '/jokenpo', iconKey: 'jokenpo', ativo: false,
    descricao: 'Melhor de cinco contra o computador. Pura sorte e instinto.' },
  { id: 'memoria', nome: 'Jogo da Memória', rota: '/memoria', iconKey: 'memoria', ativo: false,
    descricao: 'Encontre todos os pares no menor tempo e menos tentativas.' },
  { id: 'g2048', nome: '2048', rota: '/2048', iconKey: 'g2048', ativo: false,
    descricao: 'Junte blocos iguais para chegar a 2048.' },
  { id: 'forca', nome: 'Jogo da Forca', rota: '/forca', iconKey: 'forca', ativo: false,
    descricao: 'Adivinhe a palavra antes que o boneco complete.' },
  { id: 'sudoku', nome: 'Sudoku', rota: '/sudoku', iconKey: 'sudoku', ativo: false,
    descricao: 'Preencha o tabuleiro 9×9 em três níveis de dificuldade.' },
]

export const getGame = (id: GameId) => GAMES.find((g) => g.id === id)!
