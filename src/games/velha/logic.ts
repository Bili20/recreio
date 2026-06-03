// Lógica pura do Jogo da Velha — sem React, totalmente testável.

export type Marca = 'X' | 'O'
export type Celula = Marca | null
export type Tabuleiro = Celula[] // 9 posições, índices 0..8
export type Nivel = 'facil' | 'medio' | 'dificil'

// As 8 linhas vencedoras (3 horizontais, 3 verticais, 2 diagonais).
const LINHAS: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export interface Resultado { jogador: Marca; linha: [number, number, number] }

// Retorna o vencedor + a linha, ou null se ninguém venceu.
export function vencedor(t: Tabuleiro): Resultado | null {
  for (const linha of LINHAS) {
    const [a, b, c] = linha
    if (t[a] && t[a] === t[b] && t[a] === t[c]) {
      return { jogador: t[a] as Marca, linha }
    }
  }
  return null
}

export const jogadasValidas = (t: Tabuleiro): number[] =>
  t.flatMap((c, i) => (c === null ? [i] : []))

export const tabuleiroCheio = (t: Tabuleiro): boolean => t.every((c) => c !== null)

const oponente = (m: Marca): Marca => (m === 'X' ? 'O' : 'X')

// Procura uma jogada que dá vitória imediata a `marca` (ou null).
function jogadaVencedora(t: Tabuleiro, marca: Marca): number | null {
  for (const i of jogadasValidas(t)) {
    const copia = [...t]
    copia[i] = marca
    if (vencedor(copia)?.jogador === marca) return i
  }
  return null
}

// ---- Minimax (nível difícil): retorna a pontuação ótima para `vez`. ----
// +10 vitória da IA, -10 derrota, 0 empate; desconta a profundidade para preferir
// vitórias rápidas e derrotas tardias.
function minimax(t: Tabuleiro, vez: Marca, ia: Marca, prof: number): number {
  const venc = vencedor(t)
  if (venc) return venc.jogador === ia ? 10 - prof : prof - 10
  if (tabuleiroCheio(t)) return 0

  const movimentos = jogadasValidas(t)
  if (vez === ia) {
    let melhor = -Infinity
    for (const i of movimentos) {
      const copia = [...t]; copia[i] = vez
      melhor = Math.max(melhor, minimax(copia, oponente(vez), ia, prof + 1))
    }
    return melhor
  } else {
    let pior = Infinity
    for (const i of movimentos) {
      const copia = [...t]; copia[i] = vez
      pior = Math.min(pior, minimax(copia, oponente(vez), ia, prof + 1))
    }
    return pior
  }
}

function melhorJogadaMinimax(t: Tabuleiro, marca: Marca): number {
  let melhorScore = -Infinity
  let melhorIdx = jogadasValidas(t)[0]
  for (const i of jogadasValidas(t)) {
    const copia = [...t]; copia[i] = marca
    const score = minimax(copia, oponente(marca), marca, 1)
    if (score > melhorScore) { melhorScore = score; melhorIdx = i }
  }
  return melhorIdx
}

const aleatorio = (xs: number[]): number => xs[Math.floor(Math.random() * xs.length)]

// Heurística posicional para o nível médio quando não há vitória/bloqueio.
const PRIORIDADE = [4, 0, 2, 6, 8, 1, 3, 5, 7] // centro > cantos > lados

// Seleciona a jogada da IA conforme o nível.
export function escolherJogada(t: Tabuleiro, marca: Marca, nivel: Nivel): number {
  const validas = jogadasValidas(t)
  if (validas.length === 0) return -1

  if (nivel === 'facil') return aleatorio(validas)

  if (nivel === 'medio') {
    const ganhar = jogadaVencedora(t, marca)
    if (ganhar !== null) return ganhar
    const bloquear = jogadaVencedora(t, oponente(marca))
    if (bloquear !== null) return bloquear
    return PRIORIDADE.find((i) => validas.includes(i)) ?? validas[0]
  }

  // difícil
  return melhorJogadaMinimax(t, marca)
}
