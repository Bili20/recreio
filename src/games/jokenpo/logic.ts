// Lógica pura do Pedra-Papel-Tesoura — sem React, testável.

export type Jogada = 'pedra' | 'papel' | 'tesoura'
export type ResultadoRodada = 'vitoria' | 'derrota' | 'empate'

export const JOGADAS: Jogada[] = ['pedra', 'papel', 'tesoura']
export const ALVO = 3 // primeiro a 3 vitórias vence a série (melhor de 5)

// O que cada jogada vence, e o verbo da frase.
const VENCE: Record<Jogada, Jogada> = { pedra: 'tesoura', tesoura: 'papel', papel: 'pedra' }
const VERBO: Record<Jogada, string> = { pedra: 'quebra', tesoura: 'corta', papel: 'cobre' }

export function resultado(jogador: Jogada, cpu: Jogada): ResultadoRodada {
  if (jogador === cpu) return 'empate'
  return VENCE[jogador] === cpu ? 'vitoria' : 'derrota'
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Frase do ponto de vista do vencedor: "Papel cobre pedra".
export function frase(jogador: Jogada, cpu: Jogada): string {
  if (jogador === cpu) return 'Empate — joguem de novo'
  const venc: Jogada = VENCE[jogador] === cpu ? jogador : cpu
  const perd = VENCE[venc]
  return `${cap(venc)} ${VERBO[venc]} ${perd}`
}

// rng injetável para testes determinísticos; min(2,...) protege contra rng() === 1.
export const jogadaCpu = (rng: () => number = Math.random): Jogada =>
  JOGADAS[Math.min(2, Math.floor(rng() * 3))]

export const serieEncerrada = (voce: number, cpu: number): boolean =>
  voce >= ALVO || cpu >= ALVO
